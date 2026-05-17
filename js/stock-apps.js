new Vue({
  el: "#app",

  data: {
    ...app.$data,

    originalStok: JSON.parse(
      JSON.stringify(app.$data.stok)
    ),

    selectedUpbjj: "",
    selectedKategori: "",
    reorderOnly: false,
    sortBy: "judul",

    form: {
      kode: "",
      judul: "",
      qty: "",
      harga: "",
      upbjj: app.$data.upbjjList[0],
      lokasiRak: ""
    }
  },

  computed: {
    filteredStock() {
      let hasil = [...this.stok];

      if (this.selectedUpbjj) {
        hasil = hasil.filter(
          item => item.upbjj === this.selectedUpbjj
        );
      }

      if (this.selectedKategori) {
        hasil = hasil.filter(
          item => item.kategori === this.selectedKategori
        );
      }

      if (this.reorderOnly) {
        hasil = hasil.filter(
          item => item.qty <= item.safety
        );
      }

      hasil.sort((a, b) => {
        if (this.sortBy === "judul")
          return a.judul.localeCompare(b.judul);

        if (this.sortBy === "qty")
          return a.qty - b.qty;

        if (this.sortBy === "harga")
          return a.harga - b.harga;

        return 0;
      });

      return hasil;
    }
  },

  methods: {

    formatHarga(harga) {
      return harga.toLocaleString("id-ID");
    },

    statusText(item) {
      if (item.qty === 0) return "Kosong";
      if (item.qty < item.safety) return "Menipis";
      return "Tersedia";
    },

    statusClass(item) {
      if (item.qty === 0) return "kosong";
      if (item.qty < item.safety) return "menipis";
      return "tersedia";
    },

    resetFilter() {
      Swal.fire({
        title: "Reset semua data?",
        text: "Filter dan data stok tambahan akan direset",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#004098",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Ya",
        cancelButtonText: "Batal"
      }).then((result) => {
        if (result.isConfirmed) {

          this.selectedUpbjj = "";
          this.selectedKategori = "";
          this.sortBy = "judul";
          this.reorderOnly = false;

          this.stok = JSON.parse(
            JSON.stringify(this.originalStok)
          );

          this.saveStock();

          Swal.fire({
            toast: true,
            position: "top",
            icon: "success",
            title: "Berhasil direset",
            timer: 1300,
            showConfirmButton: false
          });
        }
      });
    },

    saveStock() {
      localStorage.setItem(
        "stokData",
        JSON.stringify(this.stok)
      );
    },

    loadStock() {
      let saved = JSON.parse(
        localStorage.getItem("stokData")
      );

      if (saved) {
        this.stok = saved;
      }
    },

    addItem() {

      if (
        !this.form.kode ||
        !this.form.judul ||
        this.form.qty === "" ||
        this.form.harga === ""
      ) {
        Swal.fire({
          title: "Oops!",
          text: "Lengkapi data dulu!",
          icon: "warning",
          confirmButtonColor: "#f59e0b"
        });
        return;
      }

      let newItem = {
        kode: this.form.kode,
        judul: this.form.judul,

        kategori:
          this.selectedKategori || "MK Wajib",

        upbjj: this.form.upbjj,
        lokasiRak:
          this.form.lokasiRak || "-",

        harga: Number(this.form.harga),
        qty: Number(this.form.qty),
        safety: 5,

        catatanHTML:
          this.form.qty == 0
            ? "<b>Stok tidak tersedia</b>"
            : "<i>Data baru telah ditambahkan</i>"
      };

      this.stok.push(newItem);

      this.saveStock();

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Data berhasil ditambahkan!",
        timer: 1500,
        showConfirmButton: false
      });

      this.form = {
        kode: "",
        judul: "",
        qty: "",
        harga: "",
        upbjj: this.upbjjList[0],
        lokasiRak: ""
      };
    }
  },

  mounted() {
    this.loadStock();
  }
});