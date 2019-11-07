/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.7.20 : Database - dwshop
*********************************************************************
*/

DROP DATABASE IF EXISTS `myDbs`;

CREATE DATABASE `myDbs`;

USE `myDbs`;

/* 创建myDbs_medlist表 */
DROP TABLE IF EXISTS `myDbs_medlist`;

CREATE TABLE `myDbs_medlist` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `medname` varchar(50) NOT NULL,
  `alias` varchar(20) NOT NULL,
  `medtype` varchar(20) NOT NULL,
  `spec` varchar(20),
  `bagperbox` smallint(5) NOT NULL DEFAULT 0,
  `inventoryNm` smallint(5) NOT NULL DEFAULT 0,
  `baseprice` float(10) NOT NULL DEFAULT 0,
  `sellprice` float(10) NOT NULL DEFAULT 0,
  `checked` smallint(5) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

insert into `myDbs_medlist`(`medname`,`alias`,`medtype`,`inventoryNm`,`baseprice`,`sellprice`,`checked`) values ('白术','bs','免煎',0,3,38,0), ('北豆根','bdg','免煎',5,0.39,0.8,1), ('炒山药','csy','草药',0,0.016,0.05,0) ;

/* 创建myDbs_ordlist表 */
DROP TABLE IF EXISTS `myDbs_ordlist`;

CREATE TABLE `myDbs_ordlist` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `patient` varchar(50) NOT NULL,
  `patient_id` smallint(5) unsigned,
  `medtype` varchar(20) NOT NULL,
  `dose` smallint(5) NOT NULL DEFAULT 0,
  `medarray` text,
  `total` float(10) NOT NULL DEFAULT 0,
  `date` date,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

insert into `myDbs_ordlist`(`patient`,`medtype`,`dose`,`total`,`date`) values ('李帅','免煎',10,732.3,'2019/10/22'), ('代桂玲','草药',5,225,'2019/10/23'), ('尹玉良','西药',1,24,'2019/10/22');

/* 创建myDbs_patient表 */
DROP TABLE IF EXISTS `myDbs_patient`;

CREATE TABLE `myDbs_patient` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `sex` varchar(5) NOT NULL DEFAULT '男',
  `age` smallint(5) DEFAULT 0,
  `address` varchar(20),
  `phone` int(10),
  `wechat` varchar(20),
  `lastVisit` date,
  `comment` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
