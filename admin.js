/* ==========================================================
   PBTips — admin.js
   Logic untuk halaman admin: login, lihat antrian tips,
   approve / reject / hapus.
   ========================================================== */

let currentStatusFilter = 'pending';
let queueData = []; // tips sesuai filter status yang aktif

// ----------------------------------------------------------
// 1. CEK STATUS LOGIN SAAT HALAMAN DIBUKA
// ----------------------------------------------------------
async function checkSession() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    showAdminScreen(data.session.user.email);
  } else {
    showLoginScreen();
  }
}

function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminScreen').style.display = 'none';
}

function showAdminScreen(email) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminScreen').style.display = 'block';
  document.getElementById('adminEmail').textContent = email;
  loadQueue();
}

// ----------------------------------------------------------
// 2. LOGIN / LOGOUT
// ----------------------------------------------------------
async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorBox = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  errorBox.classList.remove('show');

  if (!email || !password) {
    errorBox.textContent = 'Email dan password wajib diisi.';
    errorBox.classList.add('show');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Memeriksa...';

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  btn.disabled = false;
  btn.textContent = 'Masuk';

  if (error) {
    errorBox.textContent = 'Login gagal: email atau password salah.';
    errorBox.classList.add('show');
    return;
  }

  showAdminScreen(data.user.email);
}

async function handleLogout() {
  await supabaseClient.auth.signOut();
  showLoginScreen();
}

// ----------------------------------------------------------
// 3. FILTER TAB STATUS (pending / approved / rejected)
// ----------------------------------------------------------
function setStatusFilter(status, el) {
  currentStatusFilter = status;
  document.querySelectorAll('.status-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  loadQueue();
}

// ----------------------------------------------------------
// 4. AMBIL DATA DARI SUPABASE & HITUNG JUMLAH PER STATUS
// ----------------------------------------------------------
async function loadQueue() {
  const list = document.getElementById('queueList');
  list.innerHTML = '<p style="color:var(--muted); font-size:13px; text-align:center; padding:30px;">Memuat data...</p>';

  // Ambil SEMUA tips sekali jalan (lebih efisien daripada query 3x),
  // lalu hitung jumlah per status + filter sesuai tab aktif di sisi browser.
  const { data, error } = await supabaseClient
    .from('tips')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    list.innerHTML = '<p style="color:#f87171; font-size:13px; text-align:center; padding:30px;">Gagal memuat data. Cek console.</p>';
    return;
  }

  document.getElementById('countPending').textContent  = data.filter(t => t.status === 'pending').length;
  document.getElementById('countApproved').textContent = data.filter(t => t.status === 'approved').length;
  document.getElementById('countRejected').textContent = data.filter(t => t.status === 'rejected').length;

  queueData = data.filter(t => t.status === currentStatusFilter);
  renderQueue();
}

// ----------------------------------------------------------
// 5. RENDER DAFTAR ANTRIAN
// ----------------------------------------------------------
function renderQueue() {
  const list = document.getElementById('queueList');

  if (queueData.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="ti ti-inbox"></i>
        Tidak ada tips dengan status "${currentStatusFilter}" saat ini.
      </div>`;
    return;
  }

  list.innerHTML = queueData.map(t => `
    <div class="queue-card">
      <div class="queue-thumb" onclick="openVideoModal('${t.video_id}', '${t.title.replace(/'/g, "\\'")}', '${t.description.replace(/'/g, "\\'")}')">
        <img src="https://img.youtube.com/vi/${t.video_id}/mqdefault.jpg" alt="thumbnail" />
      </div>
      <div class="queue-body">
        <div class="queue-title">${t.title}</div>
        <div class="queue-meta">
          <span><i class="ti ti-map-pin" style="font-size:12px;"></i> ${t.map}</span>
          <span><i class="ti ti-user" style="font-size:12px;"></i> ${t.author}</span>
          <span class="status-pill ${t.status}">${t.status}</span>
        </div>
        <div class="queue-desc">${t.description}</div>
        <div class="queue-actions">
          ${currentStatusFilter !== 'approved' ? `<button class="btn-approve" onclick="updateStatus(${t.id}, 'approved')"><i class="ti ti-check"></i> Approve</button>` : ''}
          ${currentStatusFilter !== 'rejected' ? `<button class="btn-reject" onclick="updateStatus(${t.id}, 'rejected')"><i class="ti ti-x"></i> Reject</button>` : ''}
          <button class="btn-delete" onclick="deleteTip(${t.id})"><i class="ti ti-trash"></i> Hapus</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ----------------------------------------------------------
// 6. APPROVE / REJECT / HAPUS
// ----------------------------------------------------------
async function updateStatus(id, newStatus) {
  const { error } = await supabaseClient
    .from('tips')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error(error);
    alert('Gagal mengubah status. Coba lagi.');
    return;
  }
  loadQueue();
}

async function deleteTip(id) {
  if (!confirm('Hapus tips ini secara permanen?')) return;

  const { error } = await supabaseClient
    .from('tips')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    alert('Gagal menghapus. Coba lagi.');
    return;
  }
  loadQueue();
}

// ----------------------------------------------------------
// 7. MODAL VIDEO (preview sebelum approve)
// ----------------------------------------------------------
function openVideoModal(videoId, title, desc) {
  document.getElementById('vmodalFrame').src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
  document.getElementById('vmodalTitle').textContent = title;
  document.getElementById('vmodalDesc').textContent = desc;
  document.getElementById('vmodal').classList.add('show');
}
function closeVideoModal() {
  document.getElementById('vmodal').classList.remove('show');
  document.getElementById('vmodalFrame').src = '';
}
function closeModal(e) {
  if (e.target === document.getElementById('vmodal')) closeVideoModal();
}

// Tekan Enter di field password -> langsung submit login
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginPassword').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
});

// ----------------------------------------------------------
// 8. JALANKAN SAAT HALAMAN DIBUKA
// ----------------------------------------------------------
checkSession();
