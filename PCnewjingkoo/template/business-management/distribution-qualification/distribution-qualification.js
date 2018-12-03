myApp.controller('distributionQualificationController', function($scope, $rootScope, $stateParams, $state, $data) {
   //控制首页会员中心显隐
   $rootScope.isShow = false;
   //控制header和footer显隐
   $rootScope.change = true;


   $scope.saveQyHs = function() {

      $data.getUserMsg().success(function(data) {
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
   /* $scope.haveSj = function() {
      $scope.saveQyHs();
   } */
   laydate.render({
      elem: '.code-validity-input',
      range: true,
      trigger: 'click',
      range: true,
      done: function(value, date) {
         var arrDate = value.split(' - ');
         $scope.getQyMsg.company_info._code_validity_start = arrDate[0];
         $scope.getQyMsg.company_info._code_validity_end = arrDate[1];
      }
   });
   laydate.render({
      elem: '.zz-validity-input',
      trigger: 'click',
      range: true,
      done: function(value, date) {
         var arrDate = value.split(' - ');
         $scope.getQyMsg.company_info._zz_validity_start = arrDate[0];
         $scope.getQyMsg.company_info._zz_validity_end = arrDate[1];
      }
   });
   $scope.saveCodeValidity = function(e) {
      var cool = layer.load();
      $data.changeQyMsg({
         code_validity_start: $scope.getQyMsg.company_info._code_validity_start,
         code_validity_end: $scope.getQyMsg.company_info._code_validity_end
      }).success(function(data) {
         layer.close(cool);
         if (data.status == 1) {
            $scope.getQyMsg.company_info.code_validity_start = $scope.getQyMsg.company_info._code_validity_start;
            $scope.getQyMsg.company_info.code_validity_end = $scope.getQyMsg.company_info._code_validity_end;
            layer.msg(data.info, {
               icon: 1,
               time: 1000
            })
            $(e.currentTarget).parent().parent().removeClass("show");
            $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
         } else {
            layer.msg(data.info, {
               icon: 2,
               time: 3000
            })
         }
      })
   }
   $scope.saveZzValidity = function(e) {
      var cool = layer.load();
      $data.changeQyMsg({
         zz_validity_start: $scope.getQyMsg.company_info._zz_validity_start,
         zz_validity_end: $scope.getQyMsg.company_info._zz_validity_end
      }).success(function(data) {
         layer.close(cool);
         if (data.status == 1) {

            $scope.getQyMsg.company_info.zz_validity_start = $scope.getQyMsg.company_info._zz_validity_start;
            $scope.getQyMsg.company_info.zz_validity_end = $scope.getQyMsg.company_info._zz_validity_end;
            layer.msg(data.info, {
               icon: 1,
               time: 1000
            })
            $(e.currentTarget).parent().parent().removeClass("show");
            $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
         } else {
            layer.msg(data.info, {
               icon: 2,
               time: 3000
            })
         }
      })
   }

   $scope.saveThis = function(e, company_info, arg, name) {
      var cool = layer.load();
      $data.changeQyMsg({
         [name ? name : arg]: company_info["_" + arg]
      }).success(function(data) {
         layer.close(cool);
         if (data.status == 1) {

            company_info[arg] = company_info["_" + arg];
            layer.msg(data.info, {
               icon: 1,
               time: 1000
            })
            $(e.currentTarget).parent().parent().removeClass("show");
            $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
         } else {
            layer.msg(data.info, {
               icon: 2,
               time: 3000
            })
         }
      })
   }
   //		营业执照
   $scope.yyzzPhoto = function(e) {
      $data.changeQyMsg({
         zhizhao: e.img_url
      }).success(function(data) {
         if (data.status == 1) {
            var img = document.getElementById("img22");
            //图片路径设置为读取的图片
            img.src = e.base64;
         }
         layer.msg(data.info, {
            time: 3000
         });
      })
   }
   $scope.medicalPhoto = function(e) {
      $data.changeQyMsg({
         medical: e.img_url
      }).success(function(data) {
         if (data.status == 1) {
            var img = document.getElementById("img33");
            //图片路径设置为读取的图片
            img.src = e.base64;
         }
         layer.msg(data.info, {
            time: 3000
         });
      })
   }
   //身份证正面上传
   $scope.sfzBefore = function(e) {
      $data.changeQyMsg({
         zsfz: e.img_url
      }).success(function(data) {
         if (data.status == 1) {
            var img = document.getElementById("img00");
            //图片路径设置为读取的图片
            img.src = e.base64;
         }
         layer.msg(data.info, {
            time: 3000
         });
      })
   }
   //图片上传
   $scope.updatePhoto = function(e, arg) {
      $data.changeQyMsg({
         [arg]: e.img_url
      }).success(function(data) {
         if (data.status == 1) {
            $scope.getQyMsg.company_info[arg] = e.base64;
         }
         layer.msg(data.info, {
            time: 3000
         });
      })
   }
   //身份证反面上传
   $scope.sfzBehind = function(e) {
      $data.changeQyMsg({
         fsfz: e.img_url
      }).success(function(data) {
         if (data.status == 1) {
            var img = document.getElementById("img11");
            //图片路径设置为读取的图片
            img.src = e.base64;
         }
         layer.msg(data.info, {
            time: 3000
         });
      })
   }

})