var dataPengguna = [
  {
    id: 5,
    nama: "Admin SITTA",
    email: "admin@ut.ac.id",
    password: "admin123",
    role: "Administrator",
    lokasi: "Pusat"
  }
];

function login() {
  let email = document.getElementById("email")?.value.trim();
  let password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    Swal.fire({
      title: "Oops!",
      text: "Harap isi email dan password terlebih dahulu",
      icon: "warning",
      confirmButtonColor: "#f59e0b"
    });
    return;
  }

  let user = dataPengguna.find(
    u => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem("userLogin", JSON.stringify(user));

    Swal.fire({
      title: "Login Berhasil!",
      text: `Selamat datang, ${user.nama}`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      window.location.href = "dashboard.html";
    });

  } else {
    Swal.fire({
      title: "Login Gagal",
      text: "Email atau password salah",
      icon: "error",
      confirmButtonColor: "#ef4444"
    });
  }
}

function logout() {
  localStorage.removeItem("userLogin");

  Swal.fire({
    title: "Logout Berhasil!",
    text: "",
    icon: "success",
    timer: 1500,
    showConfirmButton: false
  }).then(() => {
    window.location.href = "index.html";
  });
}

function cekLogin() {
  const halamanLogin =
    window.location.pathname.includes("index.html") ||
    window.location.pathname.endsWith("/");

  const user = JSON.parse(localStorage.getItem("userLogin"));

  if (!user && !halamanLogin) {
    Swal.fire({
      title: "Akses Ditolak",
      text: "Silakan login terlebih dahulu",
      icon: "warning",
      confirmButtonColor: "#f59e0b"
    }).then(() => {
      window.location.href = "index.html";
    });
  }
}

function lupaPassword() {
  Swal.fire({
    toast: true,
    position: "top",
    icon: "info",
    title: "Fitur reset password belum tersedia",
    showConfirmButton: false,
    timer: 2500
  });
}

function daftarAkun() {
  Swal.fire({
    toast: true,
    position: "top",
    icon: "info",
    title: "Fitur daftar akun belum tersedia",
    showConfirmButton: false,
    timer: 2500
  });
}

function tampilGreeting() {
  const greeting = document.getElementById("greeting");
  if (!greeting) return;

  const user = JSON.parse(localStorage.getItem("userLogin"));
  const jam = new Date().getHours();

  let sapaan = "Selamat Datang";

  if (jam < 12) sapaan = "Selamat Pagi";
  else if (jam < 15) sapaan = "Selamat Siang";
  else if (jam < 18) sapaan = "Selamat Sore";
  else sapaan = "Selamat Malam";

  greeting.innerText = user
    ? `${sapaan}, ${user.nama}`
    : sapaan;
}

document.addEventListener("DOMContentLoaded", function () {
  cekLogin();
  tampilGreeting();
});