-- Insert default roles if they don't exist
INSERT IGNORE INTO role (name, code) VALUES ('Staff', 'STAFF');
INSERT IGNORE INTO role (name, code) VALUES ('Admin', 'ADMIN');
INSERT IGNORE INTO role (name, code) VALUES ('Customer', 'CUSTOMER');
