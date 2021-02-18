"use strict";
// Class definition
var KTDatatableUser = function () {
    // Private functions
    var options = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    url: `${location.protocol}//${window.location.host}/admin/user/getall`,
                },
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
        },

        // layout definition
        layout: {
            scroll: true, // enable/disable datatable scroll both horizontal and
            // vertical when needed.
            height: 500, // datatable's body's fixed height
            footer: false // display/hide footer
        },

        // column sorting
        sortable: true,

        pagination: true,

        // columns definition

        columns: [
        {
            field: 'image',
            title: 'Image',
            sortable: false,
            width: 100,
            template: function (row) {
                let imageName = (row.profile_image)?row.profile_image:'default_no_image.png';
                return '<image src = "' + `${location.protocol}//${window.location.host}/uploads/user/thumb/${imageName}` + '" width="80">';
        
            }
        },
        {
            field: 'full_name',
            title: 'Name',
            sortable: true,
            width: 60,
            template: function (row) {
                return row.full_name;
            },
        },
        {
            field: 'email',
            title: 'Email',
            sortable: true,
            width: 110,
            // callback function support for column rendering
            template: function (row) {
                return row.email;
            },
        }, {
            field: 'register_type',
            title: 'Type',
            sortable: true,
            width: 60,
            // callback function support for column rendering
            template: function (row) {
                return row.register_type;
            },
        },{
            field: 'followers',
            title: 'followers',
            sortable: true,
            width: 90,
            // callback function support for column rendering
            template: function (row) {
                if(row.followers.length > 0){
                    return '<a href="'+`${location.protocol}//${window.location.host}/admin/user/follow-listing/${row._id}`+'" class="btn btn-primary btn-sm">'+row.followers.length+'</a>'
                    // return row.followers.length;
                }else{
                    return 0;
                }
            },
        },{
            field: 'following',
            title: 'Following',
            sortable: true,
            width: 90,
            // callback function support for column rendering
            template: function (row) {
                if(row.following.length > 0){
                    return '<a href="'+`${location.protocol}//${window.location.host}/admin/user/following-listing/${row._id}`+'" class="btn btn-success btn-sm">'+row.following.length+'</a>'
                    //return row.following.length
                }else{
                    return '0';
                }
            },
        },{
            field: 'isActive',
            title: 'Status',
            sortable: false,
            width: 60,
            // callback function support for column rendering
            template: function (row) {
                var status = {
                    "true": {
                        'title': 'Active',
                        'class': 'kt-badge--brand'
                    },
                    "false": {
                        'title': 'Inactive',
                        'class': ' kt-badge--danger'
                    },
                };
                return '<span class="kt-badge ' + status[row.isActive].class +
                    ' kt-badge--inline kt-badge--pill KTMembershipStatusUpdate onHover curserpointer" data-id="'+row._id+'">' + status[row.isActive].title +
                    '</span>';
            },
        }, {
            field: 'Actions',
            title: 'Actions',
            sortable: false,
            width: 90,
            overflow: 'visible',
            textAlign: 'left',
            autoHide: false,
            template: function (row) {
                return '\
                    \<a href="' + location.protocol + "//" + window.location.host + '/admin/user/edit/' + row._id + '" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Edit">\
                        <i class="flaticon-edit"></i>\
                    </a>\
                    \<a id="del-' + row._id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm ktDelete" title="Delete">\
                        <i class="flaticon-delete"></i>\
                    </a>\
                ';
            },
        }],
    };

    // basic demo
    var userSelector = function () {

        options.search = {
            input: $('#generalSearch'),
        };

        var datatable = $('#userRecordSelection').KTDatatable(options);

        $('#kt_form_status').on('change', function () {
            datatable.search($(this).val(), 'Status');
        });

        $('#kt_form_type').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();

        datatable.on(
            'kt-datatable--on-check kt-datatable--on-uncheck kt-datatable--on-layout-updated',
            function (e) {
                var checkedNodes = datatable.rows('.kt-datatable__row--active').nodes();
                var count = checkedNodes.length;
                $('#kt_datatable_selected_number').html(count);
                if (count > 0) {
                    $('#kt_datatable_group_action_form').collapse('show');
                } else {
                    $('#kt_datatable_group_action_form').collapse('hide');
                }
            });

        $('#kt_modal_fetch_id').on('show.bs.modal', function (e) {
            var ids = datatable.rows('.kt-datatable__row--active').
            nodes().
            find('.kt-checkbox--single > [type="checkbox"]').
            map(function (i, chk) {
                return $(chk).val();
            });
            var c = document.createDocumentFragment();
            for (var i = 0; i < ids.length; i++) {
                var li = document.createElement('li');
                li.setAttribute('data-id', ids[i]);
                li.innerHTML = 'Selected record ID: ' + ids[i];
                c.appendChild(li);
            }
            $(e.target).find('.kt-datatable_selected_ids').append(c);
        }).on('hide.bs.modal', function (e) {
            $(e.target).find('.kt-datatable_selected_ids').empty();
        });

        $(document).on('click', '.ktDelete', function () {
            var elemID = $(this).attr('id').replace('del-', '');
            swal.fire({
                title: 'Are you sure?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                    window.location.href = `${location.protocol}//${window.location.host}/admin/user/delete/${elemID}`;
                }
            });
        });

        $(document).on('click', '.KTMembershipStatusUpdate', function(){
            var elemID = $(this).data('id');
            swal.fire({
                title: 'Are you sure?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function(result){
                if (result.value) {
                    window.location.href = `http://${window.location.host}/admin/user/status-change/${elemID}`;
                }
            });
          });
    };



    return {
        // public functions
        init: function () {
            userSelector();
        },
    };
}();

jQuery(document).ready(function () {
    KTDatatableUser.init();
});