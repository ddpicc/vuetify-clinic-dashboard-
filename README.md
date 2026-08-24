# 中医诊所医疗管理系统

一个功能完整的中医诊所管理系统，实现了开处方、管理处方和药品、收入统计、病人管理等功能，支持多诊所入驻。

## 功能特性

### 核心功能
- **处方管理** - 支持草药、免煎、西药、药丸等多种处方类型
- **药品管理** - 药品库存管理、价格管理、药品分类
- **病人管理** - 病人注册、档案管理、今日病人查看
- **数据统计** - 每天收入、每月收入、病人数量统计
- **定制药膏** - 支持膏方定制功能
- **营养配方** - 营养配方管理

### 技术特点
- 支持多诊所入驻
- 数据统计和图表展示
- 药品拼音搜索功能
- 处方打印功能
- 响应式设计，支持移动端

## 技术栈

### 前端
- Vue 2.6.11
- Vuetify 2.4.0 (UI组件库)
- Vue Router (路由管理)
- Vuex (状态管理)
- Chart.js + vue-chartkick (数据可视化)
- Axios (HTTP请求)
- vue-baidu-map (百度地图)

### 后端
- Node.js + Express
- MySQL数据库

## 快速开始

### 环境要求
- Node.js >= 14.x
- MySQL >= 5.7
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd vuetify-clinic-dashboard-
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接信息：
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=myDbs
```

4. 初始化数据库
```bash
mysql -u root -p < clinicdb.sql
```

5. 启动后端服务
```bash
node server/main.js
```

6. 启动前端开发服务器
```bash
npm run serve
```

7. 打开浏览器访问 `http://localhost:8080`

## 项目结构

```
vuetify-clinic-dashboard-
├── public/                 # 静态资源
├── server/                 # 后端服务
│   ├── api.js            # API接口
│   ├── db.js             # 数据库配置
│   ├── main.js           # 服务器入口
│   ├── router.js         # 路由配置
│   └── sqlMap.js         # SQL映射
├── src/                   # 前端源码
│   ├── assets/           # 资源文件
│   ├── components/       # 组件
│   ├── plugins/          # 插件配置
│   ├── router/           # 路由配置
│   ├── store/            # Vuex状态管理
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── .env.example          # 环境变量模板
├── package.json          # 项目配置
└── README.md             # 项目文档
```

## 主要页面

- **Dashboard** - 数据仪表盘，展示收入和病人统计
- **CreateOrd** - 生成处方
- **MedList** - 药品管理
- **PatientList** - 病人管理
- **OrderList** - 处方管理
- **Gaofang** - 定制药膏
- **Setting** - 系统设置

## 开发命令

```bash
# 启动开发服务器
npm run serve

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

## 部署

### 生产环境部署

1. 构建前端
```bash
npm run build
```

2. 配置生产环境变量
```bash
NODE_ENV=production
```

3. 使用PM2启动后端服务
```bash
npm install -g pm2
pm2 start server/main.js --name clinic-server
```

4. 配置Nginx反向代理

## 数据库说明

系统使用MySQL数据库，主要数据表：
- `qcui_user` - 用户表
- `qcui_userconfig` - 用户配置表
- `qcui_patient` - 病人信息表
- `qcui_medlist` - 药品列表表
- `qcui_ordlist` - 处方列表表
- `qcui_gaofang` - 膏方记录表
- `test_gaofang` - 测试膏方记录表
- `qcui_registerPatient` - 今日病人表

膏方功能使用诊所前缀命名表，例如测试账号使用 `test_gaofang`。

## 安全说明

- 所有敏感信息（如数据库密码）都通过环境变量配置
- 不要将 `.env` 文件提交到版本控制系统
- 生产环境建议使用HTTPS
- 定期备份数据库

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交Issue或Pull Request。