document.addEventListener('DOMContentLoaded', function () {
  var section = document.querySelector('.equipment-section');
  if (!section) return;

  var items = Array.prototype.slice.call(
    section.querySelectorAll('.equipment-item')
  );

  if (!items.length) return;

  var currentIndex = 0;

  function showItem(index) {
    items.forEach(function (item, i) {
      if (i === index) {
        item.classList.add('is-active');
        item.setAttribute('aria-hidden', 'false');
      } else {
        item.classList.remove('is-active');
        item.setAttribute('aria-hidden', 'true');
      }
    });
  }

  section.addEventListener('click', function (event) {
    var target = event.target;
    var link = target.closest('.equipment-link-next');
    if (!link || !section.contains(link)) return;

    event.preventDefault();
    currentIndex = (currentIndex + 1) % items.length;
    showItem(currentIndex);
  });

  showItem(currentIndex);
});

