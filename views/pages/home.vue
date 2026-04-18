<template>
    <div class="home_box">




			<!-- 游戏周边首页展示 -->
            <div class="homeList_view">
<div class="tableName-row">
    <div class="tableName">
    游戏周边展示
</div>
<div class="more" @click="moreClick('youxizhoubian')" style="cursor: pointer;">更多>></div>
</div>
<div class="list">
    <mySwiper :type='3' :data='youxizhoubianHomeList'
          :loop='false'
          direction='horizontal'
          :autoplay='true'
          :effectType='0'
          :freeMode='false'
          :spaceBetween='20'
          :centeredSlides='false'
          :autoHeight='false'
          :scrollbar='false'
          :slidesPerView='4'
          :pagination='false'
          :paginationType='2'
          :navigation='true'
          :slidesPerColumn='1'>
    <template #default="{row:item}">

        <div class="item" @click="detailClick('youxizhoubian',item.id)" style="cursor: pointer;">
            <img v-if="item.imgUrls" :src="item.imgUrls[0]" alt="">
            <div class="content">
<div class="title">名称：{{item.mingcheng}}</div>
<div class="title">类型：{{item.leixing}}</div>


                <div class="count-row">



                </div>
            </div>
        </div>
    
    </template>
</mySwiper>

</div>
            </div>




    </div>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance
	} from 'vue';
    const moment = window.moment
	import {
		useRouter
	} from 'vue-router';
	const context = getCurrentInstance()?.appContext.config.globalProperties;
	const router = useRouter()
    const baseUrl = ref(context.$config.url)
	//游戏周边首页展示
	const youxizhoubianHomeList = ref([])
	const getyouxizhoubianHomeList = () => {
		let params = {
			page: 1,
			limit: 10,
            sort:'id',
            order:'desc',
		}
		context?.$http({
			url: 'youxizhoubian/list',
			method: 'get',
			params: params
		}).then(res => {
			youxizhoubianHomeList.value = res.data.data.list
			youxizhoubianHomeList.value.forEach(item=>{
				if(item.fengmian!=null){
					item.imgUrls = item.fengmian.split(',').map(item=>(isHttp(item)?'':context.$config.url)+item)
				}else{
                    item.imgUrls = []
                }
			})
		})
	}
	//判断图片链接是否带http
	const isHttp = (str) => {
        return str && str.substr(0,4)=='http';
    }
	//跳转详情
	const detailClick = (table,id) => {
		router.push(`/index/${table}Detail?id=${id}`)
	}
	const moreClick = (table) => {
		router.push(`/index/${table}List`)
	}
	const init = () => {
		//游戏周边首页展示
		getyouxizhoubianHomeList()
	}
	init()
</script>

<style lang="scss">
.home_box {
    width: 1200px;
    margin: 0 auto;
    padding: 30px 0;
}
.homeList_view .tableName {
    text-align: center;
    font-size: 26px;
}

.homeList_view {
    margin-top: 30px;
}

.homeList_view .list {
    margin-top: 30px;
}

.homeList_view .item {
    background: #f0f0f0;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
}

.homeList_view img {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.homeList_view .content {
    padding: 10px 20px;
}

.homeList_view .count-row {
    display: flex;
    justify-content: space-between;
}

.homeList_view .like,.homeList_view  .collect,.homeList_view  .clicknum {
    display: flex;
    align-items: center;
    gap: 6px;
}

.homeList_view .price {
    text-align: right;
    font-size: 16px;
    color: red;
}

.homeList_view .tableName-row {position: relative;}

.homeList_view .more {
    position: absolute;
    right: 0;
    top: 14px;
    background: #f0f0f0;
    padding: 10px 30px;
}
.homeList_view .like {
    color: brown;
}

.homeList_view .collect {
    color: darkorange;
}

.homeList_view .clicknum {
    color: cadetblue;
}
</style>