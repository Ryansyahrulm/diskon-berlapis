document.addEventListener('DOMContentLoaded', function() {
    // Pop Up
    const welcomePopup = document.getElementById('welcomePopup');
    const startBtn = document.getElementById('startBtn');
    const dontShowAgainCheckbox = document.getElementById('dontShowAgain');

    // Elemen input
    const hargaAwalInput = document.getElementById('hargaAwal');
    const diskonPersenInput = document.getElementById('diskonPersen');
    const diskonNominalInput = document.getElementById('diskonNominal');
    const pajakInput = document.getElementById('pajak');
    const hitungBtn = document.getElementById('hitungBtn');

    // Elemen hasil
    const fogResult = document.getElementById('fogResult');
    const gofResult = document.getElementById('gofResult');
    const hfogResult = document.getElementById('hfogResult');
    const hgofResult = document.getElementById('hgofResult');
    const bestOption = document.getElementById('bestOption');
    const hargaAwalResult = document.getElementById('hargaAwalResult');
    const setelahFog = document.getElementById('setelahFog');
    const setelahGof = document.getElementById('setelahGof');
    const setelahHfog = document.getElementById('setelahHfog');
    const setelahHgof = document.getElementById('setelahHgof');

    const dontShowPopup = localStorage.getItem('dontShowPopup');

    // Tampilkan popup setiap kali, kecuali jika pengguna memilih "jangan tampilkan lagi"
    // if (!dontShowPopup) {
    //     welcomePopup.style.display = 'flex';
    //     // Blok scroll saat popup terbuka
    //     document.body.style.overflow = 'hidden';
    // }

    // Fungsi untuk menutup popup
    function closePopup() {
        welcomePopup.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Simpan preferensi pengguna jika checkbox dicentang
        if (dontShowAgainCheckbox.checked) {
            localStorage.setItem('dontShowPopup', 'true');
        }
    }

    // Event listener untuk tombol mulai
    startBtn.addEventListener('click', closePopup);

    // Tutup popup ketika klik di luar konten
    welcomePopup.addEventListener('click', function(e) {
        if (e.target === welcomePopup) {
            closePopup();
        }
    });



    // Fungsi untuk memformat angka sebagai Rupiah
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(angka);
    }

    // Fungsi untuk menghitung dan menampilkan hasil
    function hitungAnalisis() {
        // Ambil nilai input
        const hargaAwal = parseFloat(hargaAwalInput.value);
        const diskonPersen = parseFloat(diskonPersenInput.value);
        const diskonNominal = parseFloat(diskonNominalInput.value);
        const pajak = parseFloat(pajakInput.value);

        // Validasi input
        if (isNaN(hargaAwal) || isNaN(diskonPersen) || isNaN(diskonNominal) || isNaN(pajak)) {
            alert('Harap masukkan nilai yang valid untuk semua field!');
            return;
        }

        // Definisi fungsi
        const f = (x) => x - diskonNominal;             // Diskon nominal
        const g = (x) => x * (1 - diskonPersen / 100);  // Diskon persentase
        const h = (x) => x * (1 + pajak / 100);         // Pajak

        // Hitung komposisi fungsi
        const fog = f(g(hargaAwal));  // (f ∘ g)(x)
        const gof = g(f(hargaAwal));  // (g ∘ f)(x)
        
        const hfog = h(fog);          // (h ∘ f ∘ g)(x)
        const hgof = h(gof);          // (h ∘ g ∘ f)(x)

        // Tentukan urutan yang lebih menguntungkan
        let urutanMenguntungkan, selisih;
        if (fog < gof) {
            urutanMenguntungkan = "(f ∘ g)(x) lebih menguntungkan (diskon persentase dulu, lalu diskon nominal)";
            selisih = gof - fog;
        } else {
            urutanMenguntungkan = "(g ∘ f)(x) lebih menguntungkan (diskon nominal dulu, lalu diskon persentase)";
            selisih = fog - gof;
        }

        // Update tampilan hasil
        fogResult.textContent = formatRupiah(fog);
        gofResult.textContent = formatRupiah(gof);
        hfogResult.textContent = formatRupiah(hfog);
        hgofResult.textContent = formatRupiah(hgof);
        
        bestOption.innerHTML = `
            <strong>${urutanMenguntungkan}</strong><br>
            Selisih: ${formatRupiah(selisih)}
        `;

        // Update perbandingan harga
        hargaAwalResult.textContent = formatRupiah(hargaAwal);
        setelahFog.textContent = formatRupiah(fog);
        setelahGof.textContent = formatRupiah(gof);
        setelahHfog.textContent = formatRupiah(hfog);
        setelahHgof.textContent = formatRupiah(hgof);
    }

    // Event listener untuk tombol hitung
    hitungBtn.addEventListener('click', function() {
    hitungAnalisis();
    document.getElementById('hasilAnalisis').scrollIntoView({ behavior: 'smooth' });
    });

    // Jalankan perhitungan pertama kali saat halaman dimuat
    hitungAnalisis();
});