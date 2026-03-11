const toggleBtn = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

toggleBtn.addEventListener('click', () => {
  navMenu.classList.toggle('activo');
});
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const toggler = document.querySelector('.custom-toggler');
    toggler.addEventListener('click', function () {
      toggler.classList.toggle('collapsed');
    });
  });
</script>


