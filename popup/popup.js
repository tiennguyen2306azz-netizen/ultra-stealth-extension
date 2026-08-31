document.addEventListener('DOMContentLoaded', () => {
  const btnMasterConnect = document.getElementById('btnMasterConnect');
  const powerLabel = document.getElementById('powerLabel');
  const powerSubtext = document.getElementById('powerSubtext');
  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');

  let isConnected = true;

  function updateUI(active) {
    if (active) {
      btnMasterConnect.classList.add('active');
      powerLabel.textContent = 'ĐÃ KẾT NỐI: ĐỔI IP TOR & QUANTUM APEX v11.0';
      powerSubtext.textContent = 'Đã Đổi IP Tor • Domain Isolation • Font Shield • Anti-Trace v11.0';
      statusBadge.classList.add('active');
      statusText.textContent = 'QUANTUM SHIELD';
    } else {
      btnMasterConnect.classList.remove('active');
      powerLabel.textContent = 'NGẮT KẾT NỐI (NHẤN ĐỂ BẬT KẾT NỐI)';
      powerSubtext.textContent = 'Nhấn để Bật Đổi IP Tor, Đổi DNS & Chống Truy Vết v11.0';
      statusBadge.classList.remove('active');
      statusText.textContent = 'NGẮT KẾT NỐI';
    }
  }

  // Load saved settings
  chrome.storage.local.get(['stealthSettings'], (result) => {
    if (result && result.stealthSettings) {
      isConnected = result.stealthSettings.proxyEnabled !== false;
    } else {
      isConnected = true;
      saveSettings(true);
    }
    updateUI(isConnected);
  });

  function saveSettings(active) {
    const settings = {
      webrtcProtect: active,
      dnsPrivacyProtect: active,
      userAgentSpoof: active,
      timezoneSpoof: active,
      proxyEnabled: active
    };
    chrome.storage.local.set({ stealthSettings: settings }, () => {
      chrome.runtime.sendMessage({ action: 'UPDATE_SETTINGS', settings: settings });
    });
  }

  // Single 1-Click Connect Button Handler
  btnMasterConnect.addEventListener('click', () => {
    isConnected = !isConnected;
    updateUI(isConnected);
    saveSettings(isConnected);
  });
});
