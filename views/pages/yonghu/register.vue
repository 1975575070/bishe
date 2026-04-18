<template>
    <div class="register_view">
<div class="form" style="z-index: 1;">
    <div class="logo"></div>
    <div class="projectName">{{projectName}}注册</div>
			<div class="register_form">
				<div class="list_item">
					<div class="list_label">用户账号：</div>
					<el-input class="list_inp"
						 v-model="registerForm.yonghuzhanghao"
						 placeholder="请输入用户账号"
						 type="text"
						/>
				</div>
				<div class="list_item">
					<div class="list_label">用户密码：</div>
					<el-input class="list_inp"
						 v-model="registerForm.yonghumima"
						 placeholder="请输入用户密码"
						 type="password"
					     show-password
					 />
				</div>
				<div class="list_item">
					<div class="list_label">确认用户密码：</div>
					<el-input class="list_inp" v-model="registerForm.yonghumima2" type="password" placeholder="请输入确认用户密码" show-password />
				</div>
				<div class="list_item">
					<div class="list_label">用户姓名：</div>
					<el-input class="list_inp"
						 v-model="registerForm.yonghuxingming"
						 placeholder="请输入用户姓名"
						 type="text"
						/>
				</div>
				<div class="list_item">
					<div class="list_label">头像：</div>
					<div class="list_file_list">
						<uploads
							action="file/upload"
							tip="请上传头像"
							:fileUrls="registerForm.touxiang?registerForm.touxiang:''"
							@change="touxiangUploadSuccess">
						</uploads>
					</div>
				</div>
				<div class="list_item">
					<div class="list_label">性别：</div>
					<el-select
						class="list_sel"
						v-model="registerForm.xingbie"
						placeholder="请选择性别"
						>
						<el-option v-for="item in yonghuxingbieLists" :label="item" :value="item"></el-option>
					</el-select>
				</div>
				<div class="list_item">
					<div class="list_label">联系方式：</div>
					<el-input class="list_inp"
						 v-model="registerForm.lianxifangshi"
						 placeholder="请输入联系方式"
						 type="text"
						/>
				</div>
				<div class="list_item">
					<div class="list_label">身份证号：</div>
					<el-input class="list_inp"
						 v-model="registerForm.shenfenzhenghao"
						 placeholder="请输入身份证号"
						 type="text"
						/>
				</div>
			</div>

    <el-button class="register" @click="handleRegister">注册</el-button>
    <div class="back" @click="close">已有账号，直接登录</div>
    <div class="form-circle1"></div>
    <div class="form-circle2"></div>
</div>
<div class="circle1"></div>
<div class="circle2"></div>

	</div>
</template>
<script setup>
	import {
		ref,
		getCurrentInstance,
		nextTick,
		onMounted,
	} from 'vue';
	const context = getCurrentInstance()?.appContext.config.globalProperties;
	const projectName = context.$project.projectName
	//获取注册类型
	import { useRoute } from 'vue-router';
	const route = useRoute()
	const tableName = ref('yonghu')

	//公共方法
	const getUUID=()=> {
		return new Date().getTime();
	}
	const registerForm = ref({
        xingbie: '',
	})
	const yonghuxingbieLists = ref([])
	const init=()=>{
		yonghuxingbieLists.value = "男,女".split(',')
	}
    const touxiangUploadSuccess=(fileUrls)=> {
        registerForm.value.touxiang = fileUrls;
    }

	//注册按钮
	const handleRegister = () => {
		let url = tableName.value +"/register";
		if((!registerForm.value.yonghuzhanghao)){
			context?.$toolUtil.message(`用户账号不能为空`,'error')
			return false
		}
		if((!registerForm.value.yonghumima)){
			context?.$toolUtil.message(`用户密码不能为空`,'error')
			return false
		}
		if(registerForm.value.yonghumima!=registerForm.value.yonghumima2){
			context?.$toolUtil.message('两次密码输入不一致','error')
			return false
		}
		if(registerForm.value.touxiang!=null){
			registerForm.value.touxiang = registerForm.value.touxiang.replace(new RegExp(context?.$config.url,"g"),"");
		}
		if(registerForm.value.lianxifangshi&&(!context?.$toolUtil.isMobile(registerForm.value.lianxifangshi))){
			context?.$toolUtil.message(`联系方式应输入手机格式`,'error')
			return false
		}
		if(registerForm.value.shenfenzhenghao&&(!context?.$toolUtil.checkIdCard(registerForm.value.shenfenzhenghao))){
			context?.$toolUtil.message(`身份证号应输入身份证格式`,'error')
			return false
		}
		context?.$http({
			url:url,
			method:'post',
			data:registerForm.value
		}).then(res=>{
			context?.$toolUtil.message('注册成功','success', obj=>{
				context?.$router.push({
					path: "/login"
				});
			})
		})
	}
	//返回登录
	const close = () => {
		context?.$router.push({
			path: "/login"
		});
	}
	init()
	onMounted(()=>{

	})
</script>
<style lang="scss">
	.register_view {
        background-image: url("")!important;
	}
.register_view {
    background-color: rgb(237 245 218);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 50px;
}

.register_view .form {
    background: #fcfcf4;
    width: 700px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 50px 60px 30px 30px;
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    text-align: center;
}

.register_view .projectName {
    font-size: 24px;
    font-weight: 700;
    width: 100%;
    text-align: center;
    margin-top: 20px;
}
.register_view .logo {
    background: url(http://clfile.zggen.cn/20250725/889d208e5ddd4107bce6600713cdf6d1.webp);
    background-size: 100% 100%;
    width: 80px;
    height: 80px;
    animation: float 3s ease-in-out infinite;
    margin: 0 auto;
}
@keyframes float{
    0%,100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.register_view .circle1 {
    position: absolute;
    left: 100px;
    top: 100px;
    background: #daf4dc;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    z-index: 1;
    animation: float 4s ease-in-out infinite;
}

.register_view .circle2 {
    position: absolute;
    right: 100px;
    bottom: 100px;
    background: #EBEFD9;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    z-index: 0;
    animation: float 5s ease-in-out infinite;
}
.register_view .form-circle1 {
    position: absolute;
    right: -34px;
    top: -32px;
    background: #dff6e9;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    z-index: -1;
}

.register_view .form-circle2 {
    position: absolute;
    left: -34px;
    bottom: -32px;
    background: #f7efeb;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    z-index: -1;
}


.register_view .register_form {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 40px;
    padding: 0 50px;
}

.register_view .list_item {
    display: flex;
    align-items: center;
}

.register_view .list_label {
    min-width: 100px;
    text-align: right;
}

.register_view .list_code {
    display: flex;
}

.register_view .list_code_item {display: flex;gap: 20px;}

.register_view .register {
    background: var(--theme);
    border: none;
    color: #fff;
    width: 60%;
    margin-top: 30px;
    height: 40px;
    font-size: 18px;
}

.register_view .back {
    width: 50%;
    margin: 20px auto;
}
</style>