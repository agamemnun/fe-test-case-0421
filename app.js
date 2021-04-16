var serviceUrl = 'https://api.jsonbin.io/b/5face85443fc1e2e1b41199d',
  minUsernameLength = 3;

$(function () {
  $("form[name='registration']").validate({
    rules: {
      username: {
        required: true,
        minlength: minUsernameLength,
      },
      country: {
        required: true,
        maxlength: 1,
      },
      terms: 'required',
    },
    messages: {
      username: `Please enter at least ${minUsernameLength} characters for username`,
      country: 'Please select your country',
      terms: 'Please read and confirm',
    },
    errorPlacement: function (error, element) {
      if (element.attr('name') == 'terms') {
        error.appendTo('#error-to-show');
      } else error.insertAfter(element);
    },
    submitHandler: async function (form, event) {
      event.preventDefault();

      body = {
        username: $('#username').val(),
        country: $('select').val()[0],
        terms: $('.control .checkbox input').is(':checked'),
      };

      var response = await postData(serviceUrl, body);
      //console.log(JSON.stringify(response));
    },
  });

  $('.input').on('input', async function () {
    if ($(this).val().length > 2) {
      $(this).parent().addClass('is-loading');
      var usernames = await fetchUserNames();
      $(this).parent().removeClass('is-loading');

      usernames.forEach((item) => {
        $('.content .list-group').append(
          `<div key="${item.id}" class="list-group--item" onclick="selectItem(this)">${item.name}</div>`
        );
      });

      $('.content').css('display', 'block');
    }
  });
});

let wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchUserNames() {
  var usernames = [];
  await wait(500);
  try {
    usernames = await fetch(serviceUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    usernames = await usernames.json();
  } catch (err) {
    alert(err);
  }
  return usernames;
}

function selectItem(item) {
  var hasClass = $(item).hasClass('selected--item');
  $('.selected--item').removeClass('selected--item');

  if (!hasClass) {
    $('.input').val($(item).text());
    $('form').validate().form();
    $(item).addClass('selected--item');
    $('.help').css('display', 'block');
  } else {
    $('.input').val('');
    $('.help').css('display', 'none');
  }
}

async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
