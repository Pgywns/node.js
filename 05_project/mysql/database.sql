use dev;

--  category table
DROP TABLE IF EXISTS `t_category`;

CREATE TABLE `t_category` (
	`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `category1` varchar(100) NOT NULL DEFAULT '',
    `category2` varchar(100) NOT NULL DEFAULT '',
    `category3` varchar(100) DEFAULT '',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- seller table
DROP TABLE IF EXISTS `t_seller`;

CREATE TABLE `t_seller` (
	`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL DEFAULT '',
    `email` varchar(100) NOT NULL DEFAULT '',
    `phone` varchar(20) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- product table
DROP TABLE IF EXISTS `t_product`;

CREATE TABLE `t_product` (
	`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `product_name` varchar(200) NOT NULL DEFAULT '',
    `product_price` int(11) NOT NULL DEFAULT 0,
    `delivery_price` int(11) NOT NULL DEFAULT 0,
    `add_delivery_price` int(11) NOT NULL DEFAULT 0,
    `tags` varchar(100) DEFAULT NULL,
    `outbound_days` int(2) NOT NULL DEFAULT 5,
    `seller_id` int(11) unsigned NOT NULL,
    `category_id` int(11) unsigned NOT NULL,
    `active_yn` enum('Y', 'N') NOT NULL DEFAULT 'Y',
    `created_date` datetime NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `seller_id` (`seller_id`),
    CONSTRAINT `t_product_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `t_seller` (`id`),
    CONSTRAINT `t_product_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `t_category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- image table
DROP TABLE IF EXISTS `t_image`;

CREATE TABLE `t_image` (
	`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `product_id` int(11) unsigned NOT NULL,
    `type` int(11) NOT NULL DEFAULT 1 COMMENT '1-썸네일, 2-제품이미지, 3-제품설명이미지',
    `path` varchar(150) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`),
    KEY `product_id` (`product_id`),
    CONSTRAINT `t_image_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `t_product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- user table
DROP TABLE IF EXISTS `t_user`;

CREATE TABLE `t_user` (
	`email` varchar(50) NOT NULL DEFAULT '',
    `type` int(1) NOT NULL DEFAULT 1 COMMENT '1-buyer, 2-seller',
    `nickname` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

select * from t_seller;
select * from t_category;
select * from t_product;
select * from t_image;

insert into t_seller (name, email, phone)
values ('seller01', '01@email.com', '010-0000-0000');

insert into t_category (category1, category2, category3)
values ('컴퓨터', '주요부품', '메인보드');

insert into t_category (category1, category2, category3)
values ('컴퓨터', '주변기기', '마우스');

insert into t_product (product_name, product_price, delivery_price, seller_id, category_id)
values ('lg 마우스', 15000, 3000, 1, 2);

insert into t_product (product_name, product_price, delivery_price, seller_id, category_id)
values ('logitec 마우스', 18000, 3000, 1, 2);

insert into t_image (product_id, type, path)
values (1, 1, 'upload/3/thumbnail2.jpg');

insert into t_image (product_id, type, path)
values (2, 1, 'upload/2/thumbnail.jpg');

select concat(c.category1, '/', c.category2, '/', c.category3) as category
	  ,p.id
      ,p.product_name
      ,p.delivery_price
      ,i.*
from  t_product p join  t_category c
					on  p.category_id = c.id
				  join  t_image i
					on  p.id = i.product_id
					and i.type = 1
where p.product_name = 'lg 마우스';