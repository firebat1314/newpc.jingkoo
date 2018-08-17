myApp.controller('distributionQualificationController', function($scope, $rootScope, $stateParams, $state, $data) {
   //控制首页会员中心显隐
   $rootScope.isShow = false;
   //控制header和footer显隐
   $rootScope.change = true;

   
   $scope.saveQyHs = function() {
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $data.getUserMsg().success(function(data) {
         layer.close(cool);
         $scope.getQyMsg = data;
         /* this.params = {
           company: res.data.company,//企业名称
           province: res.data.province,//省
           city: res.data.city,//市
           district: res.data.district,//区
           address: res.data.address,//经营地址
           zctel: res.data.zctel,//注册电话
           xk: res.data.xk,//银行开户许可证
           yyzzsn: res.data.yyzzsn,//营业执照编号
           fr: res.data.fr,//法人姓名
           code_sn: res.data.code_sn,//身份证号
           mobile: res.data.mobile,//手机号
           zhizhao: null,//营业执照
           fsfz: null,//身份证正
           zsfz: null,//身份证反
           medical:null,
           brank_permit:null
         } */
      })
   }
   $scope.saveQyHs();
   $scope.haveSj = function() {
      $scope.saveQyHs();
   }

   //编辑营业执照编号
   $scope.saveQyYyzzsn = function(e, yyzzsn) {
      $data.changeQyMsg({
         yyzzsn: yyzzsn
      }).success(function(data) {
         if (data.status == 0) {
            layer.msg(data.info, {
               icon: 2,
               time: 3000
            })
         } else if (data.status == 1) {
            layer.msg(data.info, {
               icon: 1,
               time: 3000
            })
            $(e.currentTarget).parent().parent().removeClass("show");
            $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
            $scope.saveQyHs();
         }
      })
   }
   //		营业执照
   $scope.yyzzPhoto = function(e) {
      $data.changeQyMsg({
         zhizhao: e
      }).success(function(data) {
         if (data.status == 1) {
            var img = document.getElementById("img22");
            //图片路径设置为读取的图片
            img.src = e;
         }
         layer.msg(data.info, {
            time: 3000
         });
      })
   }
   $scope.medicalPhoto = function(e) {
      $data.changeQyMsg({
         medical: e
      }).success(function(data) {
         if (data.status == 1) {
            var img = document.getElementById("img33");
            //图片路径设置为读取的图片
            img.src = e;
         }
         layer.msg(data.info, {
            time: 3000
         });
      })
   }
   //身份证正面上传
   $scope.sfzBefore = function(e) {
      $data.changeQyMsg({
         zsfz: e
      }).success(function(data) {
         if (data.status == 1) {
            var img = document.getElementById("img00");
            //图片路径设置为读取的图片
            img.src = e;
         }
         layer.msg(data.info, {
            time: 3000
         });
      })
   }
   //身份证反面上传
   $scope.sfzBehind = function(e) {
      $data.changeQyMsg({
         fsfz: e
      }).success(function(data) {
         if (data.status == 1) {
            var img = document.getElementById("img11");
            //图片路径设置为读取的图片
            img.src = e;
         }
         layer.msg(data.info, {
            time: 3000
         });
      })
   }

})