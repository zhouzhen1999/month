require(["./js/config.js"], function() {
    require(["jquery", "bscroll"], function($, bscroll) {
        var page = 1,
            page_size = 6,
            type = "normal",
            total = 0,
            key = "";

        function init() {
            ajax();
            initScroll();
            addEvent()
        }
        var scroll = null;

        function initScroll() {
            scroll = new bscroll(".wrapper", {
                click: true,
                probeType: 3
            })

            scroll.on("scroll", function(position) {
                if (position.y < this.maxScrollY - 44) {
                    if (page < total) {
                        $(".main").attr("up", "释放加载更多")
                    } else {
                        $(".main").attr("up", "没有更多数据")
                    }
                } else if (position.y < this.maxScrollY - 22) {
                    if (page < total) {
                        $(".main").attr("up", "上拉加载")
                    } else {
                        $(".main").attr("up", "没有更多数据")
                    }
                } else {
                    $(".main").attr("up", "上拉加载")
                }
            })

            scroll.on("touchEnd", function() {
                if ($(".main").attr("up") == "释放加载更多") {
                    if (page < total) {
                        page++;
                        ajax();
                    }
                }
            })
        }

        function ajax() {
            $.ajax({
                url: "/api/data",
                type: "get",
                dataType: "json",
                data: {
                    page: page,
                    page_size: page_size,
                    type: type,
                    key: key
                },
                success: function(res) {
                    if (res.code == 1) {
                        total = res.total;
                        renderData(res.newData)
                    }
                }
            })
        }


        function renderData(data) {
            var str = "";
            data.forEach((i) => {
                str += `<dl>
                            <dt><img src="${i.img}" alt=""></dt>
                            <dd>
                                <p>${i.title}</p>
                                <p><span>申请退款</span><span>信用:${i.credit}</span></p>
                                <p><b>$${i.money}</b><span>${i.sale}付款</span></p>
                            </dd>
                        </dl>`;
            })
            $(".main").append(str);
            scroll.refresh();
        }

        function addEvent() {
            $("#types").on("click", function() {
                $(".types").show();
            })
            $(".types").on("click", "p", function() {
                page = 1;
                $(".types").hide();
                $(".main").html("");
                type = $(this).attr("data-type");
                ajax()
            })

            $("#sales").on("click", function() {
                page = 1;
                $(".main").html("");
                type = $(this).attr("data-type");
                ajax()

            })

            $("#search").on("click", function() {
                page = 1;
                key = $("#inp").val();
                $(".main").html("");
                ajax()
            })
        }




        init()
    })
})