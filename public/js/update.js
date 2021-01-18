$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var top = button.data('top') // Extract info from data-* attributes
    var title = button.data('title')
    var link = button.data('link')
    var total = button.data('total')
    var index = button.data('index')
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + top)
    modal.find('.modal-body #top').val(top)
    modal.find('.modal-body #title').val(title)
    modal.find('.modal-body #link').val(link)
    modal.find('.modal-body #total').val(total)
    modal.find('.modal-body #index').val(index)
  })


  $('#exampleModal2').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var top = button.data('top') // Extract info from data-* attributes
    var key = button.data('key')
    var total = button.data('total')
    var index = button.data('index')
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + top)
    modal.find('.modal-body #top').val(top)
    modal.find('.modal-body #key').val(key)
    modal.find('.modal-body #total').val(total)
    modal.find('.modal-body #index').val(index)
  })

  $("#contactForm").on('submit', function(event){
    // console.log("_contactForm", event);
    // event.preventDefault();
    // console.log("_contactForm_top", $('#top').val());
    // console.log("_contactForm_title", $('#title').val());
    // console.log("_contactForm_link", $('#link').val());
    // //$ajax.post(data,);
    // setTimeout(function(){
    //     $('#exampleModal').modal('hide');
    // }, 2000);
    
  });