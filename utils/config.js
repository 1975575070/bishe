const config = {
    get() {
        return {
            url : process.env.VUE_APP_BASE_API_URL + process.env.VUE_APP_BASE_API + '/',
            name: process.env.VUE_APP_BASE_API,
			menuList:[
				{
					name: '论坛交流',
					icon: '',
					child:[

						{
							name:'论坛交流',
                            url:'/index/forumList'

						},
					]
				},
				{
					name: '交易中心管理',
					icon: '',
					child:[

						{
							name:'交易中心',
                            url:'/index/jiaoyizhongxinList'

						},
					]
				},
			]
        }
    },
    getProjectName(){
        return {
            projectName: `基于JavaWeb的方舟游戏论坛的设计与实现`
        } 
    }
}
export default config
