/**
 * Created by lovelong on 2017/8/12.
 */
;(function( angular ){
    // 1.声明模块
    var app = angular.module( 'app',['ngRoute'] );



    // 2.声明全局控制器
    app.controller( 'wrapController',['$scope',function($scope){
        $scope.title = '豆瓣电影';
    }]);





    // 3.声明路由器,要用配置块config来声明,里面引入路由的服务,因为内部没有路由器,所以要从外部引入

    app.config(['$routeProvider',function( $routeProvider ){
        $routeProvider.when('/movie/:id',{
            templateUrl:'movie_tpl.html',
            controller:'routeController'
        }).otherwise({
            redirectTo:'/movie/in_theaters'
        })
    }])



    app.controller('routeController',['$scope','$routeParams','HttpService','baseUrl',function( $scope,$routeParams,HttpService,baseUrl){
        //console.log($routeParams.id);
        var urls = baseUrl +'/movie/'+ $routeParams.id;
        $scope.counts = 4;
        $scope.num = 0;
        $scope.nextTurnOff=true;
        $scope.preTurnOff=false;
  /*     var params = {
           count:4,
           start:0,
           apikey:'0b2bdeda43b5688921839c8ecb20399b'
       }



        HttpService.jsonp1(urls,params,function( res ){
            //console.log(res);
            // 因为是自定义的服务,angular无法识别,所以要用脏值检测
            $scope.$apply(function(){
                $scope.dataList = res;
            })


        })*/




        $scope.next=function(){
            $scope.preTurnOff=true;
            $scope.num++;
             $scope.start = $scope.counts*$scope.num+1;
            $scope.index = Math.floor($scope.dataList.total/$scope.counts);
            if( $scope.num == $scope.index ){
                $scope.nextTurnOff = false
            };
            $scope.Http( $scope.start);
        };


        $scope.pre=function(){
            $scope.num--;
            if( $scope.num == 0){
                $scope.num = 0;
                $scope.start = 0;
                $scope.preTurnOff=false;
            }else{

                $scope.start = $scope.counts*$scope.num+1;
                if( $scope.num != $scope.index ){
                    $scope.nextTurnOff = true;
                }
            }

            $scope.index = Math.floor($scope.dataList.total/$scope.counts);



            $scope.Http( $scope.start)

        }


        $scope.Http = function(starts){
            var params = {
                count:4,
                start:starts,
                apikey:'0b2bdeda43b5688921839c8ecb20399b',


            }
            HttpService.jsonp1(urls,params,function( res ){
                //console.log(res);
                // 因为是自定义的服务,angular无法识别,所以要用脏值检测
                $scope.$apply(function(){
                    $scope.dataList = res;
                })


            })
        }
        $scope.Http( 0 );
    }]);

    app.value('baseUrl','https://api.douban.com/v2');

    app.service('HttpService',['$window',function($window){
        this.jsonp1=function( url,params,fn){
        // 1. 创建一个函数
        // 2. 创建一个script函数,用src发送跨域请求
        // 3. 动态生成,创建函数名随机数,一个给src发送请求,一个给创建的函数做函数名
        // 4. 函数里面再放一个传进来的函数进行调用,都要有形参,即把外面传进来的函数进行调用,把服务器返回的参数传进去了
        // 5. 进行src拼接:
        //        url : https://api.douban.com/v2 + $routeParams.id
        //        params: count=5&start=0
        // 6. 对传进来的params进行for循环拼接
        // 7. 最后接上callback=函数名
            var fnName = 'back'+Math.random().toString().slice(3);

            $window[fnName]= function( res ){
                if( fn ){
                    fn( res )
                }
            };

            var paramsVal = '';

            for( var key in params ){
                paramsVal += key +'='+ params[key]+'&'
            }


            var srtVal = url + '?'+ paramsVal + 'callback='+ fnName;
            var script;
            script = document.createElement('script');
            script.src = srtVal;
            document.body.appendChild(script);

        }
    }])

})(angular);