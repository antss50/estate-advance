package com.javaweb.entity;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "ward_adjacency")
public class WardAdjacencyEntity {

    @EmbeddedId
    private WardAdjacencyId id;

    @Column(name = "ward_name_a", length = 255)
    private String wardNameA;

    @Column(name = "ward_name_b", length = 255)
    private String wardNameB;

    public WardAdjacencyEntity() {}

    public WardAdjacencyEntity(String wardCodeA, String wardCodeB, String wardNameA, String wardNameB) {
        this.id = new WardAdjacencyId(wardCodeA, wardCodeB);
        this.wardNameA = wardNameA;
        this.wardNameB = wardNameB;
    }

    public WardAdjacencyId getId() { return id; }
    public void setId(WardAdjacencyId id) { this.id = id; }

    public String getWardCodeA() { return id.getWardCodeA(); }
    public String getWardCodeB() { return id.getWardCodeB(); }

    public String getWardNameA() { return wardNameA; }
    public void setWardNameA(String wardNameA) { this.wardNameA = wardNameA; }

    public String getWardNameB() { return wardNameB; }
    public void setWardNameB(String wardNameB) { this.wardNameB = wardNameB; }

    // ── Composite PK ────────────────────────────────────────────────────────

    @Embeddable
    public static class WardAdjacencyId implements Serializable {

        @Column(name = "ward_code_a", length = 20)
        private String wardCodeA;

        @Column(name = "ward_code_b", length = 20)
        private String wardCodeB;

        public WardAdjacencyId() {}

        public WardAdjacencyId(String wardCodeA, String wardCodeB) {
            this.wardCodeA = wardCodeA;
            this.wardCodeB = wardCodeB;
        }

        public String getWardCodeA() { return wardCodeA; }
        public void setWardCodeA(String wardCodeA) { this.wardCodeA = wardCodeA; }

        public String getWardCodeB() { return wardCodeB; }
        public void setWardCodeB(String wardCodeB) { this.wardCodeB = wardCodeB; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof WardAdjacencyId)) return false;
            WardAdjacencyId that = (WardAdjacencyId) o;
            return Objects.equals(wardCodeA, that.wardCodeA)
                    && Objects.equals(wardCodeB, that.wardCodeB);
        }

        @Override
        public int hashCode() {
            return Objects.hash(wardCodeA, wardCodeB);
        }
    }
}