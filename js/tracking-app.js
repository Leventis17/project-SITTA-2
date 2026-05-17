new Vue({
  el: "#trackingApp",

  data: {
    ...app.$data,

    // backup data tracking bawaan
    originalTracking: JSON.parse(
      JSON.stringify(app.$data.tracking)
    ),

    form: {
      nim: "",
      nama: "",
      ekspedisi: "Reguler (3-5 hari)",
      paket: "",
      tanggalKirim: new Date()
        .toISOString()
        .substr(0, 10)
    },

    resi: "",
    hasil: null,
    notFound: false
  },

  computed: {
    selectedPaket() {
      return this.paket.find(
        p => p.kode === this.form.paket
      );
    },

    totalHarga() {
      if (!this.selectedPaket) return 0;
      return this.selectedPaket.harga;
    }
  },

  methods: {

    // ======================
    // Generate nomor DO
    // ======================
    generateDONumber() {
      let keys = Object.keys(this.tracking);
      let max = 0;

      keys.forEach(key => {
        let nomor = parseInt(
          key.split("-")[1]
        );

        if (nomor > max) {
          max = nomor;
        }
      });

      return "DO2025-" +
        String(max + 1).padStart(4, "0");
    },

    // ======================
    // Save ke localStorage
    // ======================
    saveTracking() {
      localStorage.setItem(
        "trackingData",
        JSON.stringify(this.tracking)
      );
    },

    // ======================
    // Load dari localStorage
    // ======================
    loadTracking() {
      let saved = JSON.parse(
        localStorage.getItem("trackingData")
      );

      if (saved) {
        this.tracking = saved;
      }
    },

    // ======================
    // Reset tracking
    // ======================
    resetTracking() {
      Swal.fire({
        title: "Reset semua data?",
        text: "Tracking tambahan akan dihapus",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#004098",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Ya",
        cancelButtonText: "Batal"
      }).then((result) => {

        if (result.isConfirmed) {

          // reset form
          this.form = {
            nim: "",
            nama: "",
            ekspedisi: "Reguler (3-5 hari)",
            paket: "",
            tanggalKirim: new Date()
              .toISOString()
              .substr(0, 10)
          };

          // kembalikan data tracking default
          this.tracking = JSON.parse(
            JSON.stringify(
              this.originalTracking
            )
          );

          // overwrite localStorage
          this.saveTracking();

          Swal.fire({
            toast: true,
            position: "top",
            icon: "success",
            title: "Berhasil direset",
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    },

    // ======================
    // Tambah tracking
    // ======================
    addTracking() {

      if (
        !this.form.nim ||
        !this.form.nama ||
        !this.form.paket
      ) {
        Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Lengkapi data dulu!"
        });
        return;
      }

      let nomorDO =
        this.generateDONumber();

      this.$set(
        this.tracking,
        nomorDO,
        {
          nim: this.form.nim,
          nama: this.form.nama,
          status: "Diproses",
          ekspedisi: this.form.ekspedisi,
          tanggalKirim:
            this.form.tanggalKirim,
          paket: this.form.paket,
          total: this.totalHarga,

          perjalanan: [
            {
              waktu: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " - "),

              keterangan:
                "Pesanan sedang diproses"
            }
          ]
        }
      );

      this.saveTracking();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "DO berhasil dibuat"
      });

      this.form = {
        nim: "",
        nama: "",
        ekspedisi: "Reguler (3-5 hari)",
        paket: "",
        tanggalKirim: new Date()
          .toISOString()
          .substr(0, 10)
      };
    },

    // ======================
    // Cari tracking
    // ======================
    cariTracking() {
      let data =
        this.tracking[this.resi];

      if (data) {
        this.hasil = {
          noDO: this.resi,
          ...data
        };

        this.notFound = false;

      } else {
        this.hasil = null;
        this.notFound = true;
      }
    }
  },

  mounted() {
    this.loadTracking();
  }
});