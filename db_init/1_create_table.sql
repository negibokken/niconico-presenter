set global max_connections = 500;
create database if not exists niconico_presenter default character set utf8mb4 collate utf8mb4_unicode_ci;
use niconico_presenter;

create table if not exists user (
   id INTEGER NOT NULL AUTO_INCREMENT,
   session MEDIUMTEXT NOT NULL,
   primary key (id)
) character set utf8mb4 collate utf8mb4_unicode_ci;

create table if not exists comment (
   id INTEGER NOT NULL AUTO_INCREMENT,
   user_id MEDIUMTEXT NOT NULL,
   content MEDIUMTEXT NOT NULL,
   nice INTEGER NOT NULL DEFAULT 0,
   created_at DATETIME NOT NULL DEFAULT current_timestamp,
   updated_at DATETIME NOT NULL DEFAULT current_timestamp on update current_timestamp,
   primary key (id)
) character set utf8mb4 collate utf8mb4_unicode_ci;

create table if not exists nices (
   id INTEGER NOT NULL AUTO_INCREMENT,
   user_id MEDIUMTEXT NOT NULL,
   comment_id INTEGER NOT NULL,
   primary key (id)
) character set utf8mb4 collate utf8mb4_unicode_ci;