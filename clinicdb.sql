/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.7.20 : Database - dwshop
*********************************************************************
*/

CREATE DATABASE `myDbs`;

USE `myDbs`;

/* 创建table表 */
DROP TABLE IF EXISTS `myDbs_medlist`;

CREATE TABLE `myDbs_medlist` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `medname` varchar(50) NOT NULL,
  `alias` varchar(20) NOT NULL,
  `medtype` varchar(20) NOT NULL,
  `spec` varchar(20),
  `bagperbox` varchar(20),
  `inventoryNm` smallint(5) NOT NULL DEFAULT '0',
  `baseprice` float(10) NOT NULL DEFAULT '0',
  `sellprice` float(10) NOT NULL DEFAULT '0',
  `checked` smallint(5) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

insert  into `myDbs_medlist`(`medname`,`alias`,`medtype`,`inventoryNm`,`baseprice`,`sellprice`,`checked`) values ('白术','bs','免煎',0,3,38,0)
