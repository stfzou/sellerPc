<template>
	<div class="logo_warp">
		<div class="head">
			<img src="../../assets/header@2x.png" alt="">
		</div>
		<div class="login_content">
			<div class="login_form">
				<h3>{{title}}</h3>
				<ul>
					<li class="phone" v-show="phoneState">
						<input v-model="phone" type="text" placeholder="请输入您的手机号" />
					</li>
					<li class="pwd" v-show="pwdState">
						<input v-model="pwd" type="password" placeholder="请输入您的密码" />
					</li>
					<li class="yz" v-show="yzState">
						<input v-model="yz" type="text" placeholder="请输入您的验证码" />
						<span class="getcode pointer" v-show="show" @click="getCode">获取验证码</span>
						<span v-show="!show" class="count getcode pointer">{{count}} 秒</span>
					</li>
				</ul>
				<el-button :plain="true" v-if="registerBtn" @click="registerRuler">立即注册</el-button>
				<el-button :plain="true" v-if="loginBtn" @click="loginRuler">立即登录</el-button>
				<el-button :plain="true" v-if="nextBtn" @click="next">下一步</el-button>
				<el-button :plain="true" v-if="changeBtn" @click="changeRuler">完成</el-button>

				<div class="login_btn" v-if="registerBtom">
					<span class="pointer" @click="login">已有账号？直接登录</span>
				</div>
				<div class="login_btn" v-if="loginBtom">
					<span class="pointer" @click="forget">忘记密码</span>/
					<span class="pointer" @click="register">商家入驻</span>
				</div>
				<div class="login_btn" v-if="forgetBtom">
					<span class="pointer" @click="login">立即登录</span>/
					<span class="pointer" @click="register">商家入驻</span>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				count: '',
				timer: null,
				phone: '',
				pwd: '',
				yz: '',
				reg: /^1[3456789]\d{9}$/,
				title: '商家入驻',
				//标签状态
				phoneState: true,
				pwdState: true,
				yzState: true,
				//按钮状态
				registerBtn: true,
				loginBtn: false,
				nextBtn: false,
				changeBtn: false,
				//底部文字状态
				registerBtom: true,
				loginBtom: false,
				forgetBtom: false,
				//忘记密码时的状态
				forgetState:false
			};
		},
		methods: {
			getCode() {
				//获取验证码
				if (this.phone) {
					let _this = this;
					const TIME_COUNT = 60;
					if (!this.timer) {
						this.count = TIME_COUNT;
						this.show = false;
						if(!this.forgetState){
							this.axios.get('/shops_sms_register?phone=' + this.phone, {
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded'
									}
								})
								.then(function(response) {
									console.log(response);
								})
								.catch(function(error) {
									console.log(error);
								});
						}else{
							this.axios.get('/sms_getpwd?phone=' + this.phone, {
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded'
									}
								})
								.then(function(response) {
									console.log(response);
								})
								.catch(function(error) {
									console.log(error);
								});
						}
						
						this.timer = setInterval(() => {
							if (this.count > 0 && this.count <= TIME_COUNT) {
								this.count--;
							} else {
								this.show = true;
								clearInterval(this.timer);
								this.timer = null;
							}
						}, 1000)
					}
				}

			},
			registerRuler() {
				//注册
				let self = this;
				if (this.phone === '') {

					this.$message({
						showClose: true,
						message: '手机号不能为空哦',
						type: 'error',
					});
					return false;
				} else if (!this.reg.test(this.phone)) {

					this.$message({
						showClose: true,
						message: '手机号码输入错误',
						type: 'error',
					});
					return false;
				} else if (this.pwd === '') {

					this.$message({
						showClose: true,
						message: '密码不能为空',
						type: 'error',
					});
					return false;
				} else if (this.pwd.length < 6) {

					this.$message({
						showClose: true,
						message: '密码长度不能小于6位',
						type: 'error',
					});
					return false;
				} else if (this.yz === '') {

					this.$message({
						showClose: true,
						message: '验证码不能为空',
						type: 'error',
					});
					return false;
				} else {
					this.axios.post('/shops_u_register', this.qs.stringify({
						phone: this.phone,
						password: this.pwd,
						v_code: this.yz
					}), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).then(function(res) {

						if (res.data.code === 1) {

							self.$message({
								showClose: true,
								message: '注册成功',
								type: 'success',
							})
							self.title = "账号登录"
							self.phoneState = true
							self.pwdState = true
							self.yzState = false
							//按钮状态
							self.registerBtn = false
							self.loginBtn = true
							self.nextBtn = false
							self.changeBtn = false
							//底部文字状态
							self.registerBtom = false
							self.loginBtom = true
							self.forgetBtom = false

						} else {
							console.log(res)
							self.$message.error(res.data.msg);
						}

					}).catch(function(err) {
						console.log(err)
					})


				}
			},
			login() {
				let self = this;
				this.title = "账号登录"
				this.phoneState = true
				this.pwdState = true
				this.yzState = false
				//按钮状态
				this.registerBtn = false
				this.loginBtn = true
				this.nextBtn = false
				this.changeBtn = false
				//底部文字状态
				this.registerBtom = false
				this.loginBtom = true
				this.forgetBtom = false
				//登录时的状态
				this.forgetState = false;

			},
			register() {
				this.title = "商家入驻"
				this.phoneState = true
				this.pwdState = true
				this.yzState = true
				//按钮状
				this.registerBtn = true
				this.loginBtn = false
				this.nextBtn = false
				this.changeBtn = false
				//底部文字状态
				this.registerBtom = true
				this.loginBtom = false
				this.forgetBtom = false
			},
			forget() {
				this.title = "忘记密码"
				this.phoneState = true
				this.pwdState = false
				this.yzState = true
				//按钮状态
				this.registerBtn = false
				this.loginBtn = false
				this.nextBtn = true
				this.changeBtn = false
				//底部文字状态
				this.registerBtom = false,
				this.loginBtom = false,
				this.forgetBtom = true
				//忘记密码时的状态
				this.forgetState = true;
			},
			next() { //下一步
				if (this.phone === '') {
					this.$message({
						showClose: true,
						message: '手机号不能为空哦',
						type: 'error',
					});
					return false;
				} else if (!this.reg.test(this.phone)) {

					this.$message({
						showClose: true,
						message: '手机号码输入错误',
						type: 'error',
					});
					return false;
				} else if (this.yz === '') {

					this.$message({
						showClose: true,
						message: '验证码不能为空',
						type: 'error',
					});
					return false;
				} else {
					let self = this;
					this.axios.post('/chekegetPwd', this.qs.stringify({
						phone: this.phone,
						v_code: this.yz
					}), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).then(function(res){
						
						if(res.data.code == 1){
							let loading = self.$loading({
													lock: true,
													text: '加载中，请稍后',
													spinner: 'el-icon-loading',
													background: 'rgba(0, 0, 0, 0.7)'
											});
							
							
							setTimeout(() => {
								loading.close();
								self.$message({
									showClose: true,
									message:'验证成功',
									type: 'success',
								});
							}, 2000);
							self.title = "忘记密码"
							self.phoneState = false
							self.pwdState = true
							self.yzState = false,
							//按钮状态
							self.registerBtn = false,
							self.loginBtn = false,
							self.nextBtn = false,
							self.changeBtn = true,
							//底部文字状态
							self.registerBtom = false,
							self.loginBtom = false,
							self.forgetBtom = true
						}else{
							self.$message({
								showClose: true,
								message:res.data.msg,
								type: 'success',
							});
						}
						
					})
					
				}


			},
			changeRuler() { //完成验证
				if (this.pwd === '') {

					this.$message({
						showClose: true,
						message: '密码不能为空',
						type: 'error',
					});
					return false;
				} else if (this.pwd < 6) {

					this.$message({
						showClose: true,
						message: '密码不能小于6位数',
						type: 'error',
					});
					return false;
				} else {
					let self = this;
					this.axios.post('/updateGetPwd', this.qs.stringify({
						phone: this.phone,
						password: this.pwd
					}), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).then(function(res){
						if(res.data.code == 1){
							let loading = self.$loading({
													lock: true,
													text: '加载中，请稍后',
													spinner: 'el-icon-loading',
													background: 'rgba(0, 0, 0, 0.7)'
											});
							
							
							setTimeout(() => {
								loading.close();
								self.$message({
									showClose: true,
									message:'修改成功',
									type: 'success',
								});
							}, 2000);
							self.login();
							
						}else{
							self.$message({
								showClose: true,
								message: res.data.msg,
								type: 'error',
							});
						}
					})
					
				}
			},
			loginRuler() { 
				//登录验证
				
				let self = this;

				if (this.phone === '') {

					this.$message({
						showClose: true,
						message: '手机号不能为空哦',
						type: 'error',
					});
					return false;
				} else if (!this.reg.test(this.phone)) {

					this.$message({
						showClose: true,
						message: '手机号码输入错误',
						type: 'error',
					});
					return false;
				} else if (this.pwd === '') {

					this.$message({
						showClose: true,
						message: '密码不能为空',
						type: 'error',
					});
					return false;
				} else {
					let loading = this.$loading({
						lock: true,
						text: '加载中，请稍后',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});

					this.axios.post('/shops_u_login', this.qs.stringify({
						phone: this.phone,
						password: this.pwd,
					}), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).then(function(res) {
						
						if (res.data.code === 1) {
						
							var userEntity = {
								userName: res.data.user.userName,
								userId: res.data.user.userId,
								userPhone: res.data.user.phone,
								shopId:res.data.user.userShops.shopId,
								shopTypeName:res.data.user.userShops.shopName,
								shopStatus:res.data.user.userShops.shopStatus
							};
							sessionStorage.setItem('user', JSON.stringify(userEntity));
							self.$message({
								showClose: true,
								message: '登录成功',
								type: 'success',
							});
							setTimeout(() => {
								loading.close();
							}, 1000);
							if (res.data.user.userShops.shopStatus === 0) {
								
								self.$router.push({
									name: 'dataReady'
								})
							}else if(res.data.user.userShops.shopStatus === 4) {
								
								self.$router.push({
									name: 'qualificationsInfo',
									params: { shopTypeName: res.data.user.userShops.shopName }
								})
							}else if(res.data.user.userShops.shopStatus === 3){
								
								self.$message.error('审核失败');
								
							}else if(res.data.user.userShops.shopStatus === 2){
								
								self.$router.push({
									name: 'addGoods'
								})
							}else if(res.data.user.userShops.shopStatus === 1){
								
								self.$router.push({
									name: 'storeSuccess'
								})
								
							}
							
						}else {
							loading.close();
							self.$message.error(res.data.msg);
						}
					}).catch(function(err){
						
						self.$message.error('网络出了一点问题');
						loading.close();
						
					})

				}
			}

		},
	}
</script>

<style lang="scss">
	.el-loading-spinner i {
		color: #FF523D;
		font-size: 30px;
	}

	.el-loading-spinner .el-loading-text {
		color: #FF523D;
		font-size: 18px;
	}

	.logo_warp {
		position: relative;
		height: 100%;
		background: url(../../assets/loginwarp_bg.png) no-repeat center center;
		background-size: cover;
		overflow: hidden;

		.head {
			width: 800px;
			margin: 0 auto;
			margin-top: 32px;
		}

		.login_content {
			height: 448px;
			width: 800px;
			background: #fff;
			margin: 49px auto 0 auto;
			background: url(../../assets/login_bg.png) no-repeat center center;
			background-size: cover;
			padding: 40px 30px 40px 0;
			box-sizing: border-box;

			.login_form {
				float: right;
				width: 300px;

				h3 {
					font-size: 18px;
					color: #333;

				}

				ul {
					margin-top: 60px;

					li {
						height: 38px;
						border-radius: 20px;
						background: #f2f2f2;
						padding-left: 64px;
						margin-bottom: 28px;

						input {
							outline: none;
							background: #f2f2f2;
							height: 38px;
							line-height: 38px;
							display: inline-block;
						}
					}

					.phone {
						background: #f2f2f2 url(../../assets/icon-person@2x.png) no-repeat 10px;
						background-size: 24px;

					}

					.pwd {
						background: #f2f2f2 url(../../assets/icon-key@2x.png) no-repeat 10px;
						background-size: 24px;

					}

					.yz {
						background: #f2f2f2 url(../../assets/icon_yanzheng@2x.png) no-repeat 10px;

						input {
							width: 145px;
						}

						.getcode {
							height: 20px;
							line-height: 20px;
							border-radius: 10px;
							background: #FF523D;
							font-size: 12px;
							color: #fff;
							width: 80px;
							text-align: center;
							display: inline-block;
						}

					}
				}

				.el-button {
					width: 100%;
					outline: none;
					display: block;
					border-radius: 20px;
					background: #FF523D;
					border: none;
					height: 38px;
					line-height: 38px;
					padding: 0;
					color: #fff;
				}

				.login_btn {
					text-align: right;
					font-size: 14px;
					color: #333;
					margin-top: 40px;
					cursor: pointer;

					span {
						color: #409EFF;
					}
				}

			}
		}
	}
</style>
