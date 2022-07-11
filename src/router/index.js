import { createRouter, createWebHashHistory , createWebHistory} from "vue-router";

//前端页面(PC)


// import Home from '@/components/home/Home.vue';
const Home = () => import('@/components/home/Home.vue');

const Main = () => import('@/components/home/page/Main.vue');
const Detail = () => import('@/components/home/page/Detail.vue');
const Cart = () => import('@/components/home/page/Cart.vue');
const Order = () => import('@/components/home/page/Order.vue');
const OrderPay = () => import('@/components/home/page/OrderPay.vue');
const Pay = () => import('@/components/home/page/Pay.vue');
const Manger = () => import('@/components/home/page/Manger.vue');

//后台页面
const Admin = () => import('@/components/admin/Admin.vue');
const Type = () => import('@/components/admin/page/Type.vue');
const Type_93 = () => import('@/components/admin/page/Type 93.vue');
const Book = () => import('@/components/admin/page/Book.vue');
const BookEdit = () => import('@/components/admin/page/BookEdit.vue');
const News = () => import('@/components/admin/page/News.vue');
const NewsAdd = () => import('@/components/admin/page/NewsAdd.vue');
const Dingdan = () => import('@/components/admin/page/Dingdan.vue');
const User = () => import('@/components/admin/page/User.vue');
const Admin_add = () => import('@/components/admin/page/Admin_add.vue');



const routes = [

	{
		path: '/',
		redirect: {
			name: 'Main',
		}
	},


	{
		path: '/home',
		name: Home,
		component: Home,

		children: [
			{
				path: '',
				name: 'Main',
				component: Main, //首页主页

			},

			{
				path: 'detail',
				name: 'Detail',
				component: Detail //商品详情页
			},

			{
				path: 'cart',
				name: 'Cart',
				component: Cart, //购物车页
				meta: {
					role: 'P'
				},
			},

			{
				path: 'order',
				name: 'Order',
				component: Order, //我的订单
				meta: {
					role: 'P'
				},
			},

			{
				path: 'orderpay',
				name: 'OrderPay',
				component: OrderPay, //支付
				meta: {
					role: 'P'
				},
			},

			{
				path: 'pay',
				name: 'Pay',
				component: Pay, //支付
				meta: {
					role: 'P'
				},
			},

			{
				path: 'manger',
				name: 'Manger',
				component: Manger, //我的订单
				meta: {
					role: 'P'
				},
			}


		]
	},


	{
		path: '/admin',
		name: Admin,
		component: Admin,
		meta: {
			role: 'G'
		},
		children: [
			{
				path: 'type',
				name: 'Type',
				component: Type,
			},

			{
				path: 'type_93',
				name: 'Type_93',
				component: Type_93,
			},

			{
				path: 'book',
				name: 'Book',
				component: Book,
			},

			{
				path: 'news',
				name: 'News',
				component: News,
			},

			{
				path: 'newsadd',
				name: 'NewsAdd',
				component: NewsAdd,
			},

			{
				path: 'bookedit',
				name: 'BookEdit',
				component: BookEdit,
			},

			{
				path: 'dingdan',
				name: 'Dingdan',
				component: Dingdan,
			},

			{
				path: 'user',
				name: 'User',
				component: User,
			},

			{
				path: 'admin_add',
				name: 'Admin_add',
				component: Admin_add,
			},

		]

	}


];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});


router.beforeEach((to, form, next) => {
	//1.在任意一个地址跳转的时候,从本地存储中获取当前登录的角色值
	let role = localStorage.getItem('role');

	//没有限制的路由地址也能正常访问
	if (to.meta.role == undefined || to.meta.role == '') {
		next();
		return;
	}

	//进入后台首页：role是否与规则中的要求匹配
	//判断即将进入的路由规则中限制的访问角色规则 是否与当前登录者的角色匹配

	if (to.meta.role == role) {
		//继续进入
		next();		
		return;
	}
	//以上都不需要的路由,默认跳转返回
	router.replace('/').catch((error) => {
		console.log('地址不存在');

	})

})

export default router;
