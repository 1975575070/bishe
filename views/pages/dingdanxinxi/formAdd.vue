<template>
	<div class="edit_view">
        <div class="breadcrumb-wrapper" style="width: 100%;">
            <div class="bread_view">
                <el-breadcrumb separator="Ξ" class="breadcrumb">
                    <el-breadcrumb-item class="first_breadcrumb" :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item class="second_breadcrumb" v-for="(item,index) in breadList" :key="index">{{item.name}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
		<el-form ref="formRef" :model="form" class="add_form" label-width="120px" :rules="rules">
			<el-row>
				<el-col :span="8">
					<el-form-item label="交易名称" prop="jiaoyimingcheng">
						<el-input class="list_inp"
                                  v-model="form.jiaoyimingcheng"
                                  placeholder="交易名称"
                                  type="text"
							      :readonly="!isAdd||disabledForm.jiaoyimingcheng?true:false" />
					</el-form-item>
				</el-col>

				<el-col :span="8">
					<el-form-item label="类型" prop="leixing">
						<el-input class="list_inp"
                                  v-model="form.leixing"
                                  placeholder="类型"
                                  type="text"
							      :readonly="!isAdd||disabledForm.leixing?true:false" />
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="封面" prop="fengmian">
						<uploads
							:disabled="!isAdd||disabledForm.fengmian?true:false"
							action="file/upload" 
							tip="请上传封面"
							style="width: 100%;text-align: left;"
							:fileUrls="form.fengmian?form.fengmian:''" 
							@change="fengmianUploadSuccess">
						</uploads>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="价格" prop="jiage">
						<el-input class="list_inp"
                                  v-model.number="form.jiage"
                                  placeholder="价格"
                                  type="number"
							      :readonly="!isAdd||disabledForm.jiage?true:false" />
					</el-form-item>
				</el-col>

				<el-col :span="8">
					<el-form-item label="购买者账号" prop="goumaizhezhanghao">
						<el-input class="list_inp"
                                  v-model="form.goumaizhezhanghao"
                                  placeholder="购买者账号"
                                  type="text"
							      :readonly="!isAdd||disabledForm.goumaizhezhanghao?true:false" />
					</el-form-item>
				</el-col>

				<el-col :span="8">
					<el-form-item label="购买者姓名" prop="goumaizhexingming">
						<el-input class="list_inp"
                                  v-model="form.goumaizhexingming"
                                  placeholder="购买者姓名"
                                  type="text"
							      :readonly="!isAdd||disabledForm.goumaizhexingming?true:false" />
					</el-form-item>
				</el-col>

				<el-col :span="8">
					<el-form-item label="用户账号" prop="yonghuzhanghao">
						<el-input class="list_inp"
                                  v-model="form.yonghuzhanghao"
                                  placeholder="用户账号"
                                  type="text"
							      :readonly="!isAdd||disabledForm.yonghuzhanghao?true:false" />
					</el-form-item>
				</el-col>

				<el-col :span="8">
					<el-form-item label="用户姓名" prop="yonghuxingming">
						<el-input class="list_inp"
                                  v-model="form.yonghuxingming"
                                  placeholder="用户姓名"
                                  type="text"
							      :readonly="!isAdd||disabledForm.yonghuxingming?true:false" />
					</el-form-item>
				</el-col>

			</el-row>
			<div class="formModel_btn_box">
				<el-button class="formModel_cancel" @click="backClick">取消</el-button>
				<el-button class="formModel_confirm"
                           @click="save"
                           type="success"
				>
                    提交
				</el-button>
                <payForm ref="payRef" @close="payClose" @paySave="paySave"></payForm>
			</div>
		</el-form>
	</div>
</template>
<script setup>
	import {
		ref,
		getCurrentInstance,
		watch,
		onUnmounted,
		onMounted,
		nextTick,
		computed
	} from 'vue';
	import {
		useRoute,
		useRouter
	} from 'vue-router';
    import moment from "moment";
	const context = getCurrentInstance()?.appContext.config.globalProperties;
	const route = useRoute()
	const router = useRouter()
	//基础信息
	const tableName = 'dingdanxinxi'
	const formName = '订单信息'
	//基础信息
	const breadList = ref([{
		name: formName
	}])
	//获取唯一标识
	const getUUID =()=> {
      return new Date().getTime();
    }
	//form表单
	const form = ref({
		jiaoyimingcheng: '',
		leixing: '',
		fengmian: '',
		jiage: 0,
		goumaizhezhanghao: '',
		goumaizhexingming: '',
		yonghuzhanghao: '',
		yonghuxingming: '',
	})
	const formRef = ref(null)
	const id = ref(0)
	const type = ref('')
	const disabledForm = ref({
		jiaoyimingcheng : false,
		leixing : false,
		fengmian : false,
		jiage : false,
		goumaizhezhanghao : false,
		goumaizhexingming : false,
		ispay : false,
		yonghuzhanghao : false,
		yonghuxingming : false,
	})
	const isAdd = ref(false)
	//表单验证
	const rules = ref({
		jiaoyimingcheng: [
		],
		leixing: [
		],
		fengmian: [
		],
		jiage: [
			{ validator: context.$toolUtil.validator.number, trigger: 'blur' },
		],
		goumaizhezhanghao: [
		],
		goumaizhexingming: [
		],
		ispay: [
		],
		yonghuzhanghao: [
		],
		yonghuxingming: [
		],
	})
	//封面上传回调
	const fengmianUploadSuccess=(e)=>{
		form.value.fengmian = e
	}
	//methods

	//获取info
	const getInfo = ()=>{
		context?.$http({
			url: `${tableName}/info/${id.value}`,
			method: 'get'
		}).then(res => {
			let reg=new RegExp('../../../file','g')
			form.value = res.data.data
		})
	}
	const crossRow = ref('')
	const crossTable = ref('')
	const crossTips = ref('')
	const crossColumnName = ref('')
	const crossColumnValue = ref('')
	//初始化
	const init = (formId=null,formType='add',formNames='',row=null,table=null,statusColumnName=null,tips=null,statusColumnValue=null) => {
		if(formId){
			id.value = formId
			type.value = formType
		}
		if(formType == 'add'){
			isAdd.value = true
		}else if(formType == 'info'){
			isAdd.value = false
			getInfo()
		}else if(formType == 'edit'){
			isAdd.value = true
			getInfo()
		}
		else if(formType == 'cross'){
			isAdd.value = true
			// getInfo()
			for(let x in row){
				if(x=='jiaoyimingcheng'){
					form.value.jiaoyimingcheng = row[x];
					disabledForm.value.jiaoyimingcheng = true;
					continue;
				}
				if(x=='leixing'){
					form.value.leixing = row[x];
					disabledForm.value.leixing = true;
					continue;
				}
				if(x=='fengmian'){
					form.value.fengmian = row[x];
					disabledForm.value.fengmian = true;
					continue;
				}
				if(x=='jiage'){
					form.value.jiage = row[x];
					disabledForm.value.jiage = true;
					continue;
				}
				if(x=='goumaizhezhanghao'){
					form.value.goumaizhezhanghao = row[x];
					disabledForm.value.goumaizhezhanghao = true;
					continue;
				}
				if(x=='goumaizhexingming'){
					form.value.goumaizhexingming = row[x];
					disabledForm.value.goumaizhexingming = true;
					continue;
				}
				if(x=='yonghuzhanghao'){
					form.value.yonghuzhanghao = row[x];
					disabledForm.value.yonghuzhanghao = true;
					continue;
				}
				if(x=='yonghuxingming'){
					form.value.yonghuxingming = row[x];
					disabledForm.value.yonghuxingming = true;
					continue;
				}
			}
			if(row){
				crossRow.value = row
			}
			if(table){
				crossTable.value = table
			}
			if(tips){
				crossTips.value = tips
			}
			if(statusColumnName){
				crossColumnName.value = statusColumnName
			}
			if(statusColumnValue){
				crossColumnValue.value = statusColumnValue
			}
		}
		context?.$http({
			url: `${context?.$toolUtil.storageGet('frontSessionTable')}/session`,
			method: 'get'
		}).then(res => {
			var json = res.data.data
			if(json.hasOwnProperty('yonghuzhanghao') && context?.$toolUtil.storageGet("frontSessionTable")!="users"){
				form.value.goumaizhezhanghao = json.yonghuzhanghao
				disabledForm.value.goumaizhezhanghao = true;
			}
			if(json.hasOwnProperty('yonghuxingming') && context?.$toolUtil.storageGet("frontSessionTable")!="users"){
				form.value.goumaizhexingming = json.yonghuxingming
				disabledForm.value.goumaizhexingming = true;
			}
            if (localStorage.getItem('autoSave')) {
                localStorage.removeItem('autoSave')
                save()
            }
		})
	}
	//初始化
	//取消
	const backClick = () => {
		history.back()
	}
	//提交
	const save=()=>{
		if(form.value.fengmian!=null) {
			form.value.fengmian = form.value.fengmian.replace(new RegExp(context?.$config.url,"g"),"");
		}
		var table = crossTable.value
		var objcross = JSON.parse(JSON.stringify(crossRow.value))
		let crossUserId = ''
		let crossRefId = ''
		let crossOptNum = ''
		formRef.value.validate(async (valid)=>{
			if(valid){
                if(type.value == 'cross'){
                    if(crossColumnName.value!=''){
                        if(!crossColumnName.value.startsWith('[')){
                            for(let o in objcross){
                                if(o == crossColumnName.value){
                                    objcross[o] = crossColumnValue.value
                                }
                            }
                            //修改跨表数据
                            changeCrossData(objcross)
                        }else{
                            crossUserId = context?.$toolUtil.storageGet('userid')
                            crossRefId = objcross['id']
                            crossOptNum = crossColumnName.value.replace(/\[/,"").replace(/\]/,"")
                        }
                    }
                }
				if(crossUserId&&crossRefId){    //限制用户操作次数
					form.value.crossuserid = crossUserId
					form.value.crossrefid = crossRefId
					let params = {
						page: 1,
						limit: 1000, 
						crossuserid:form.value.crossuserid,
						crossrefid:form.value.crossrefid,
					}
					context?.$http({
						url: `${tableName}/page`,
						method: 'get', 
						params: params 
					}).then(async (res)=>{
						if(res.data.data.total>=crossOptNum){
							context?.$toolUtil.message(`${crossTips.value}`,'error')
							return false
						}else{
							context?.$http({
								url: `${tableName}/${!form.value.id ? "save" : "update"}`,
								method: 'post', 
								data: form.value 
							}).then(res=>{
                                if(context.$toolUtil.isBackAuth('dingdanxinxi','支付')){
                                    context.$http.get(`${tableName}/page?sort=id&order=desc`).then(res1=>{
                                        payRef.value.payClick(tableName,res1.data.data.list[0])
                                    })
                                    return
                                }
                                context?.$toolUtil.message(`操作成功`,'success')
                                history.back()
							})
						}
					})
				}else{
					context?.$http({
						url: `${tableName}/${!form.value.id ? "save" : "update"}`,
						method: 'post', 
						data: form.value 
					}).then(res=>{
                        if(context.$toolUtil.isBackAuth('dingdanxinxi','支付')){
                            context.$http.get(`${tableName}/page?sort=id&order=desc`).then(res1=>{
                                payRef.value.payClick(tableName,res1.data.data.list[0])
                            })
                            return
                        }
                        context?.$toolUtil.message(`操作成功`,'success')
                        history.back()
					})
				}
			}
		})
	}
    import payForm from '@/components/payForm'
    const payRef = ref(null)
    const payClose = (e)=>{
        history.back()
    }
    const paySave = async(data)=>{
        data.ispay = '已支付'
        context?.$http({
            url: `${tableName}/update`,
            method: 'post',
            data: data
        }).then(res => {
            context.$message.success('支付成功')
            payRef.value.payVisible = false
        })
    }
	//修改跨表数据
	const changeCrossData=(row)=>{
        if(type.value == 'cross'){
            context?.$http({
                url: `${crossTable.value}/update`,
                method: 'post',
                data: row
            }).then(res=>{})
        }
	}
	onMounted(()=>{
		type.value = route.query.type?route.query.type:'add'
		let row = null
		let table = null
		let statusColumnName = null
		let tips = null
		let statusColumnValue = null
		if(type.value == 'cross'){
			row = context?.$toolUtil.storageGet('crossObj')?JSON.parse(context?.$toolUtil.storageGet('crossObj')):{}
			table = context?.$toolUtil.storageGet('crossTable')
			statusColumnName = context?.$toolUtil.storageGet('crossStatusColumnName')
			tips = context?.$toolUtil.storageGet('crossTips')
			statusColumnValue = context?.$toolUtil.storageGet('crossStatusColumnValue')
		}
		init(route.query.id?route.query.id:null, type.value,'', row, table, statusColumnName, tips, statusColumnValue)
	})
    onUnmounted(()=>{
        Object.keys(localStorage).map(item=>{
            if(item.startsWith('cross')){
                localStorage.removeItem(item)
            }
        })
    })
</script>
<style lang="scss" scoped>
	// 表单
	.add_form{
		// form item
		:deep(.el-form-item) {
			// 内容盒子
			.el-form-item__content {
			}
		}
	}
</style>
<style lang="scss">
.edit_view {
    margin: 20px auto;
    width: 1200px;
    position: relative;
    background: rgb(255, 255, 255);
    font-size:16px;
    color:#666;
}
.edit_view .add_form{
    width: 100%;
    padding: 30px;
    border:1px solid #eee;
}
.edit_view .add_form .el-form-item{
    margin: 0px 0px 20px;
    display: flex;
}
.edit_view .add_form .el-form-item .el-form-item__label{
    width: 150px;
    background: none;
    text-align: right;
    display: block;
    font-size: 16px;
    color: rgb(51, 51, 51);
    font-weight: 500;
}
.edit_view .add_form .el-form-item .el-form-item__content{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    width: calc(100% - 120px);
}
.edit_view .list_inp .el-input__wrapper{
    height: 36px;
}








.edit_view .add_form .el-form-item .el-form-item__content .el-upload--picture-card{
    background-color: rgb(255, 255, 255);
    width: 100px;
    height: 90px;
    line-height: 100px;
    text-align: center;
    
    border-radius: 0px;
    cursor: pointer;
}

.edit_view .add_form .el-form-item .el-form-item__content .el-upload--picture-card .el-icon{
    font-size: 32px;
    color: #999;
}

.edit_view .add_form .el-form-item .el-form-item__content .img-uploader .el-upload__tip{
    font-size: 15px;
    color: #666;
    margin: 0;
}



</style>