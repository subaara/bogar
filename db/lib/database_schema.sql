DROP DATABASE IF EXISTS student_exam;
CREATE DATABASE student_exam;
USE student_exam;

CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE KEY,
    password varchar(100),
    role ENUM('admin', 'staff', 'student')
);

delimiter $

DROp trigger IF EXISTS init_user;
CREATE TRIGGER init_user BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    DECLARE pwd VARCHAR(100);
    set pwd = NEW.password;
    SET NEW.user_id = UUID();
    SET NEW.password = SHA2(CONCAT(NEW.user_id, pwd), 256);
END;$

DROP PROCEDURE IF EXISTS validate_login;$
CREATE PROCEDURE validate_login(p_username VARCHAR(100), p_password VARCHAR(100))
BEGIN
    DECLARE u_id CHAR(36);
    SET u_id = (SELECT user_id FROM users WHERE username = p_username LIMIT 1);
    SELECT user_id, username, role from users WHERE username = p_username AND password = SHA2(CONCAT(u_id, p_password), 256);
END$
CALL validate_login(7, 7);$


insert into users (username, password, role) values ('subash', 'subash', 'admin');$
insert into users (username, password, role) values ('7', '7', 'admin');$
insert into users (username, password, role) values ('  ', '  ', 'admin');$