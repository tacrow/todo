// http://www.buildinsider.net/web/bookjslib111/86
//putしてそのmodelの変化を監視して、再レンダリングする（変化があったときに再レンダリング）
//その祭にulの中身をリセットさせる必要があるかも
//✓：フォームセットのボタンを付ける

// http://qiita.com/yuku_t/items/7095a32cc5e438172844

$(function(){
    // Todo Model
    var Todo = Backbone.Model.extend({
        urlRoot: '/mongo/',
        idAttribute: "_id"
    });
    
    // Todo Collection
    var TodoList = Backbone.Collection.extend({
        url: '/mongo/',
        model: Todo
    });
    
    // View（Model）
    var ListItemView = Backbone.View.extend({
        tagName: 'li',
        className : 'listTodo',
        initialize: function() {
            _.bindAll(this, "render", "remove");
            // オブザーバパターンを利用してモデルのイベントを購読
            this.model.bind("change", this.render);
        },
        events: {
            'click .js-setform': 'setform',
            'click .js-delete': 'delete'
        },
        setform: function() {
            var id = $(event.target).data('id');
            this.model.set({"_id": id});
            this.model.fetch({
                dataType: 'json',
                success: function(model, data){
                    $('#js-inputId').val(id);
                    $('#js-todoText').val(data.memo);
                    $('#js-inputPriority').val(data.priority);
                    $('#js-inputStatus').val(data.status_flag);
                    $('#js-inputLimitDate').val(data.limit_date);
                }
            });
        },
        delete: function() {
            var id = $(event.target).data('id');
            this.model.set({"_id": id});
            this.model.destroy();
            $(this.el).remove();
            return this;
        },
        changerender: function(model){
            this.model = model;
            this.render();
        },
        render: function() {
            
            console.log("mdoel render");
            var priority_arr = ['低','中','高'];
            var status_arr   = ['未着手','着手中','完了'];
 
            var priority = priority_arr[this.model.get('priority')];
            var status = status_arr[this.model.get('status_flag')];
            var now = new Date(this.model.get('register_date'));
            var registerDate = {
                "year": now.getFullYear(),
                "month": now.getMonth()+1,
                "date": now.getDate(),
                "hour": now.getHours(),
                "minut": now.getMinutes()
            }
            //テンプレート
            var html =
                '<p class="memo js-memo">' + this.model.get('memo') + '</p>\n' +
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
                this.model.get('limit_date') + '</span></span>\n' +
                '</div>\n' +
                '<button class="btn btn-setform js-setform" data-id="' +
                this.model.get('_id') + '">編集</button>\n' +
                '<button class="btn btn-delete js-delete" type="submit" data-id="' +
                this.model.get('_id') + '">削除</button>\n';
    
            $(this.el).html(html);
            return this;
        }
    });    
    
    //View（Collection）
    var ListView = Backbone.View.extend({
        el: '#js-todoList',
        listitemview: null,
    	initialize: function() {
            this.model = new Todo;
            this.collection = new TodoList;
            
           _.bindAll(this, "appendItem", "changeItem");
            this.model.bind("change", this.changeItem);
            this.collection.bind("add", this.appendItem);
            this.getTodo();
        },
        getTodo: function() {
            var that = this;
            this.collection.fetch({
                dataType : 'json',
                success: function(model, data){
                    that.collection.reset(data);
                }
            });
        },
        resetItems: function (collection) {
            console.log("render");
            this.collection.each(function (model) {
                this.appendItem(model); 
            }, this);
        },
        appendItem: function (model) {
            console.log('appendItem');
            this.listitemview = new ListItemView({model:model});
            $(this.el).append(this.listitemview.render().el);
        },
        changeItem: function(model) {
            console.log("changeItem");
            this.listitemview.changerender(model);
        },
        add: function(event) {
            console.log("list view add");
            event.preventDefault();
            var that = this;
            var id = $('#js-inputId').val();
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
            //_idが空ではなかったら_idをセットする
            if(id != ''){
                reqData._id = id;
            }
            console.log(reqData);
            this.model.set(reqData);
            this.model.save(null, {
                success : function(model, resp) {
                    alert('success', resp);
                    if(id == '') {
                        that.collection.add(reqData);
                    }
                },
                error : function(model, resp) {
                    alert('error', resp);
                    return false;
                }
            });
        }
    });
    
    //AppView
    var AppView  = Backbone.View.extend({
        el: 'body',
        listview: null,
    	initialize: function() {
            this.listview = new ListView;
        },
        events: {
            'click #js-btnRegistry': 'addListView'
        },
        addListView: function(event) {
            console.log('listview',this.listview);
           this.listview.add(event);
        }
    });
    
    var app = new AppView;

});