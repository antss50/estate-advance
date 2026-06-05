import json
import argparse
import os
import sys
from itertools import combinations
from pathlib import Path

try:
    from shapely.geometry import shape
    from shapely.validation import make_valid
except ImportError:
    print("Cài đặt shapely: pip install shapely")
    sys.exit(1)

try:
    from tqdm import tqdm
    HAS_TQDM = True
except ImportError:
    HAS_TQDM = False

def load_features(paths):
    features = []
    for path in paths:
        with open(path, encoding='utf-8') as f:
            data = json.load(f)
        items = data.get('features', [])
        print(f"  Đọc {len(items):,} đối tượng từ {os.path.basename(path)}")
        features.extend(items)
    return features

def safe_shape(feature):
    try:
        geom = shape(feature['geometry'])
        if not geom.is_valid:
            geom = make_valid(geom)
        return geom
    except Exception as e:
        print(f"  [LỖI] {feature['properties'].get('ma_xa', '?')}: {e}")
        return None

def find_adjacent_pairs(wards):
    pairs = set()
    n = len(wards)
    iterable = combinations(range(n), 2)
    if HAS_TQDM:
        iterable = tqdm(iterable, total=n*(n-1)//2, desc="Kiểm tra giáp ranh", unit="cặp")
    for i, j in iterable:
        code_a, geom_a = wards[i]
        code_b, geom_b = wards[j]
        try:
            if geom_a.touches(geom_b) or geom_a.intersects(geom_b):
                # Lưu cặp theo thứ tự (min, max) để tránh trùng
                pairs.add((min(code_a, code_b), max(code_a, code_b)))
        except Exception:
            pass
    return pairs

def write_sql(pairs, code_to_name, output_path):
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("-- =============================================\n")
        f.write("-- Bảng ward_adjacency (kèm tên phường)\n")
        f.write("-- =============================================\n\n")
        f.write("SET FOREIGN_KEY_CHECKS = 0;\n")
        f.write("TRUNCATE TABLE ward_adjacency;\n\n")

        # Thêm cột tên nếu chưa có
        f.write("ALTER TABLE ward_adjacency\n")
        f.write("  ADD COLUMN IF NOT EXISTS ward_name_a VARCHAR(255),\n")
        f.write("  ADD COLUMN IF NOT EXISTS ward_name_b VARCHAR(255);\n\n")

        # Chèn dữ liệu
        chunk = []
        for a, b in sorted(pairs):
            name_a = code_to_name.get(a, '').replace("'", "''")
            name_b = code_to_name.get(b, '').replace("'", "''")
            # Hai chiều: (a,b) và (b,a)
            chunk.append(f"('{a}','{b}','{name_a}','{name_b}')")
            chunk.append(f"('{b}','{a}','{name_b}','{name_a}')")

            if len(chunk) >= 500:
                f.write("INSERT IGNORE INTO ward_adjacency\n")
                f.write("  (ward_code_a, ward_code_b, ward_name_a, ward_name_b)\n")
                f.write("VALUES\n")
                f.write(",\n".join(chunk) + ";\n\n")
                chunk = []
        if chunk:
            f.write("INSERT IGNORE INTO ward_adjacency\n")
            f.write("  (ward_code_a, ward_code_b, ward_name_a, ward_name_b)\n")
            f.write("VALUES\n")
            f.write(",\n".join(chunk) + ";\n\n")

        f.write("SET FOREIGN_KEY_CHECKS = 1;\n")

    print(f"Xuất {len(pairs)*2:,} dòng -> {output_path}")

def main():
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--folder", help="Thư mục chứa các file GeoJSON")
    group.add_argument("--files", nargs="+", help="Danh sách file GeoJSON cụ thể")
    parser.add_argument("--ext", default=".json", help="Đuôi file (mặc định .json)")
    parser.add_argument("--output", default="ward_adjacency.sql", help="File SQL đầu ra")
    parser.add_argument("--code-field", default="ma_xa", help="Tên trường mã phường trong properties")
    parser.add_argument("--name-field", default="ten_xa", help="Tên trường tên phường trong properties")
    args = parser.parse_args()

    if args.folder:
        folder = Path(args.folder)
        paths = sorted(folder.glob(f"*{args.ext}")) or sorted(folder.glob("*.geojson"))
        if not paths:
            print(f"Không tìm thấy file nào trong {folder}")
            sys.exit(1)
    else:
        paths = [Path(f) for f in args.files]

    print(f"\n=== Tạo bảng giáp ranh phường/xã ===\n")
    print(f"Input : {len(paths)} file(s)")
    print(f"Output: {args.output}\n")

    print("1. Đọc dữ liệu GeoJSON...")
    features = load_features(paths)
    print(f"   Tổng số đối tượng: {len(features):,}\n")

    print("2. Xử lý hình học...")
    code_to_name = {}
    wards = []
    for f in features:
        props = f.get('properties', {})
        code = props.get(args.code_field)
        name = props.get(args.name_field)
        if not code or not name:
            continue
        geom = safe_shape(f)
        if geom:
            wards.append((code, geom))
            code_to_name[code] = name
    print(f"   Hợp lệ: {len(wards):,} phường/xã\n")

    print("3. Tìm các cặp giáp ranh...")
    pairs = find_adjacent_pairs(wards)
    print(f"   Số cặp (không trùng): {len(pairs):,}\n")

    print("4. Xuất file SQL...")
    write_sql(pairs, code_to_name, args.output)

    print("\nHoàn tất! Import vào MySQL bằng lệnh:")
    print(f"  mysql -u root -p tên_database < {args.output}")

if __name__ == "__main__":
    main()