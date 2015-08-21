// http://www.buildinsider.net/web/bookjslib111/86

$(function(){
    // Todo Model
    var Todo = Backbone.Model.extend({
        urlRoot: '/mongo/',
        idAttribute: "_id"
    });
    
    // Todo Collection
    var TodoList = Backbone.Collection.extend({
        model: Todo
    });
    var todoList = new TodoList([]);
    
    // View
    var ListView = Backbone.View.extend({
        el: '#js-todoList',
//         tododata: [],
        initialize: function() {
            this.model = new Todo;
            this.collection = new TodoList;
            this.getTodo();
        },
        events: {
            'click .js-todoItem': 'setform',
            'click .js-delete': 'delete'
        },
        setform: function() {
            var id = $(event.target).children('.js-delete').attr('data-id');
            this.model.set({"_id": id});
            this.model.fetch({
                dataType: 'json',
                success: function(model, data){
                    $('#js-todoText').val(data.memo);
                    $('#js-inputPriority').val(data.priority);
                    $('#js-inputStatus').val(data.status_flag);
                    $('#js-inputLimitDate').val(data.limit_date);
                }
            });
            
        },
        delete: function() {
            var id = $(event.target).attr('data-id');
            this.model.set({"_id": id});
            this.model.destroy();
        },
        getTodo: function() {
            var that = this;
            this.model.fetch({
                dataType : 'json',
                success: function(model, data){
                    todoList = data;
                    that.render();
                }
            });
        },
        render: function() {            
            var priority_arr = ['低','中','高'];
            var status_arr   = ['未着手','着手中','完了'];
            for(var i = 0; i < todoList.length; i++) {
                var priority = priority_arr[todoList[i].priority];
                var status = status_arr[todoList[i].status_flag];
                var now = new Date(todoList[i].register_date);
                var registerDate = {
                    "year": now.getFullYear(),
                    "month": now.getMonth()+1,
                    "date": now.getDate(),
                    "hour": now.getHours(),
                    "minut": now.getMinutes()
                }
                //テンプレート
                var html = '<li class="listTodo js-todoItem">\n' +
                                '<p class="memo js-memo">' + todoList[i].memo + '</p>\n' +
                                    '<span class="dateRegister">' +
                                        registerDate.year + '/' +
                                        registerDate.month + '/' +
                                        registerDate.date + ', ' +
                                        registerDate.hour + ':' +
                                        registerDate.minut +
                                    '</span>\n' +
                                '<div class="boxStatus">\n' +
                                    '<span class="priority js-priority">' + priority + '</span>\n' +
                                    '<span class="status js-status">' + status + '</span>\n' +
                                    '<span class="dateLimit js-limit">締切：<span class="">' +
                                        todoList[i].limit_date + '</span></span>\n' +
                                '</div>\n' +
                                '<button class="btn btn-delete js-delete" data-id="' +
                                    todoList[i]._id + '" type="submit">削除</button>\n' +
                            '</li>';
                this.$el.append(html);
            }
        }
    });    
    
    var AppView = Backbone.View.extend({
    	el: 'body',
    	initialize: function() {
            this.model = new Todo;
            this.collection = new TodoList;
            this.listview = new ListView;
        },
        events: {
            'click #js-btnRegistry': 'add'
        },
        add: function() {
            var todoText = $('#js-todoText').val();
            var inputPriority = $('#js-inputPriority').val();
            var inputStatus = $('#js-inputStatus').val();
            var inputLimitDate = $('#js-inputLimitDate').val();
            var now = new Date();
            var reqData = {
                "memo": todoText,
                "register_date": now,
                "priority": inputPriority,
                "status_flag": inputStatus,
                "limit_date": inputLimitDate
            }
            this.model.set(reqData);
            this.collection.add(reqData);
            this.model.save(null, {
                success : function(model, resp) {
                    alert('成功', resp);
                    //add collection
                },
                error : function(model, resp) {
                    alert('エラー', resp);
                    return false;
                }
            });
        }
    });
    
    var AppView = new AppView;

});