/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.7.20 : Database - dwshop
*********************************************************************
*/

DROP DATABASE IF EXISTS `myDbs`;

CREATE DATABASE `myDbs`;

USE `myDbs`;

/* 创建qcui_medlist表 */
DROP TABLE IF EXISTS `qcui_medlist`;

CREATE TABLE `qcui_medlist` (
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

insert into `qcui_medlist`(`medname`,`alias`,`medtype`,`spec`,`inventoryNm`,`baseprice`,`sellprice`,`checked`) values ('白术','bs','免煎','袋',0,3,38,0), ('北豆根','bdg','免煎','袋',5,0.39,0.8,1), ('炒山药','csy','草药','克',0,0.016,0.05,0) ;

/* 创建test_medlist表 */
DROP TABLE IF EXISTS `test_medlist`;

CREATE TABLE `test_medlist` (
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

insert into `test_medlist`(`medname`,`alias`,`medtype`,`spec`,`inventoryNm`,`baseprice`,`sellprice`,`checked`) values ('白芍','bs','免煎','袋',0,3,38,0), ('熟地','sd','免煎','袋',5,0.39,0.8,1), ('炒山楂','csz','草药','克',0,0.016,0.05,0) ;

/* 创建qcui_ordlist表 */
DROP TABLE IF EXISTS `qcui_ordlist`;

CREATE TABLE `qcui_ordlist` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `patient` varchar(50) NOT NULL,
  `patient_id` smallint(5) unsigned,
  `medtype` varchar(20) NOT NULL,
  `patient_sex` varchar(5) NOT NULL DEFAULT '男',
  `patient_age` smallint(5) DEFAULT 0,
  `patient_phone` int(10),
  `symptom` varchar(255),
  `order_comment` varchar(255),
  `dose` smallint(5) NOT NULL DEFAULT 0,
  `medarray` text,
  `total` float(10) NOT NULL DEFAULT 0,
  `totalprofit` float(10) NOT NULL DEFAULT 0,
  `date` date,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


/* 创建test_ordlist表 */
DROP TABLE IF EXISTS `test_ordlist`;

CREATE TABLE `test_ordlist` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `patient` varchar(50) NOT NULL,
  `patient_id` smallint(5) unsigned,
  `medtype` varchar(20) NOT NULL,
  `patient_sex` varchar(5) NOT NULL DEFAULT '男',
  `patient_age` smallint(5) DEFAULT 0,
  `patient_phone` int(10),
  `symptom` varchar(255),
  `order_comment` varchar(255),
  `dose` smallint(5) NOT NULL DEFAULT 0,
  `medarray` text,
  `total` float(10) NOT NULL DEFAULT 0,
  `date` date,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

/* 创建qcui_patient表 */
DROP TABLE IF EXISTS `qcui_patient`;

CREATE TABLE `qcui_patient` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `name_pinyin` varchar(50) NOT NULL,
  `sex` varchar(5) NOT NULL DEFAULT '男',
  `age` float(5) NOT NULL DEFAULT 0,
  `address` varchar(20),
  `phone` varchar(20),
  `wechat` varchar(20),
  `lastVisit` date,
  `comment` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

/* 创建test_patient表 */
DROP TABLE IF EXISTS `test_patient`;

CREATE TABLE `test_patient` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `name_pinyin` varchar(50) NOT NULL,
  `sex` varchar(5) NOT NULL DEFAULT '男',
  `age` float(5) NOT NULL DEFAULT 0,
  `address` varchar(20),
  `phone` varchar(20),
  `wechat` varchar(20),
  `lastVisit` date,
  `comment` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

/* 创建user表 */
DROP TABLE IF EXISTS `myDbs_user`;

CREATE TABLE `myDbs_user` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `token` varchar(50) NOT NULL,
  `role` varchar(20) NOT NULL,
  `dbs_prefix` varchar(20),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

insert into `myDbs_user`(`username`,`password`,`token`,`role`,`dbs_prefix`) values ('qcui','8890','1c2b','admin','qcui_'), ('test','test','3d4a','test','test_');

/* 创建user表 */
DROP TABLE IF EXISTS `myDbs_userconfig`;

CREATE TABLE `myDbs_userconfig` (
  `userid` smallint(5) unsigned NOT NULL,
  `overallIncome` float(10) NOT NULL DEFAULT 0,
  `overallProfit` float(10) NOT NULL DEFAULT 0,
  `income_2020` float(10) NOT NULL DEFAULT 0,
  `profit_2020` float(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* 创建user表 */
DROP TABLE IF EXISTS `myDbs_clinicOverall`;

CREATE TABLE `myDbs_clinicOverall` (
  `clinicId` smallint(5) unsigned NOT NULL,
  `overallTotal` float(50) NOT NULL DEFAULT 0,
  PRIMARY KEY (`clinicId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

