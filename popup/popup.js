document.addEventListener('DOMContentLoaded', () => {
  const btnMasterConnect = document.getElementById('btnMasterConnect');
  const powerLabel = document.getElementById('powerLabel');
  const powerSubtext = document.getElementById('powerSubtext');
  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');

  const btnToggleProxyBox = document.getElementById('btnToggleProxyBox');
  const proxyBox = document.getElementById('proxyBox');
  const radioTor = document.getElementById('radioTor');
  const radioCustom = document.getElementById('radioCustom');
  const customProxyInputs = document.getElementById('customProxyInputs');
  const customProxyType = document.getElementById('customProxyType');
  const customProxyHost = document.getElementById('customProxyHost');
  const customProxyPort = document.getElementById('customProxyPort');
  const btnSaveCustomProxy = document.getElementById('btnSaveCustomProxy');

  let currentSettings = {
    proxyEnabled: true,
    proxyMode: 'tor',
    customProxyType: 'socks5',
    customProxyHost: '127.0.0.1',
    customProxyPort: 1080
  };

  // Fetch status
  chrome.runtime.sendMessage({ action: 'GET_STATUS' }, (response) => {
    if (response && response.settings) {
      currentSettings = { ...currentSettings, ...response.settings };
      updateUI();
    }
  });

  function updateUI() {
    const active = !!currentSettings.proxyEnabled;

    if (active) {
      btnMasterConnect.classList.add('active');
      statusBadge.classList.add('active');
      statusText.textContent = 'APEX SHIELD';

      if (currentSettings.proxyMode === 'custom') {
        powerLabel.textContent = 'ĐÃ KẾT NỐI: CUSTOM PROXY ACTIVE';
        powerSubtext.textContent = `Đã Đổi IP (${currentSettings.customProxyType.toUpperCase()}://${currentSettings.customProxyHost}:${currentSettings.customProxyPort})`;
      } else {
        powerLabel.textContent = 'ĐÃ KẾT NỐI: ĐỔI IP TOR & ẨN DANH MAX';
        powerSubtext.textContent = 'Đã Đổi IP Tor • Anti-Bot Bypass • Layout Jitter • Anti-Trace v13.5';
      }
    } else {
      btnMasterConnect.classList.remove('active');
      statusBadge.classList.remove('active');
      statusText.textContent = 'NGẮT KẾT NỐI';
      powerLabel.textContent = 'NGẮT KẾT NỐI (NHẤN ĐỂ BẬT KẾT NỐI)';
      powerSubtext.textContent = 'Nhấn để Bật Đổi IP Proxy, Đổi DNS & Chống Truy Vết v13.5';
    }

    if (currentSettings.proxyMode === 'custom') {
      radioCustom.checked = true;
      customProxyInputs.classList.remove('hidden');
    } else {
      radioTor.checked = true;
      customProxyInputs.classList.add('hidden');
    }

    customProxyType.value = currentSettings.customProxyType || 'socks5';
    customProxyHost.value = currentSettings.customProxyHost || '127.0.0.1';
    customProxyPort.value = currentSettings.customProxyPort || 1080;
  }

  // Save Settings helper
  function saveAndApply() {
    const updated = {
      webrtcProtect: !!currentSettings.proxyEnabled,
      dnsPrivacyProtect: !!currentSettings.proxyEnabled,
      userAgentSpoof: !!currentSettings.proxyEnabled,
      timezoneSpoof: !!currentSettings.proxyEnabled,
      proxyEnabled: !!currentSettings.proxyEnabled,
      proxyMode: radioCustom.checked ? 'custom' : 'tor',
      customProxyType: customProxyType.value,
      customProxyHost: customProxyHost.value.trim() || '127.0.0.1',
      customProxyPort: parseInt(customProxyPort.value, 10) || 1080
    };

    currentSettings = { ...currentSettings, ...updated };
    chrome.storage.local.set({ stealthSettings: currentSettings }, () => {
      chrome.runtime.sendMessage({ action: 'UPDATE_SETTINGS', settings: currentSettings });
      updateUI();
    });
  }

  // Toggle Proxy Box
  btnToggleProxyBox.addEventListener('click', () => {
    proxyBox.classList.toggle('hidden');
  });

  // Proxy Mode Radio Handlers
  radioTor.addEventListener('change', () => {
    customProxyInputs.classList.add('hidden');
    saveAndApply();
  });

  radioCustom.addEventListener('change', () => {
    customProxyInputs.classList.remove('hidden');
    saveAndApply();
  });

  // Save Custom Proxy Button
  btnSaveCustomProxy.addEventListener('click', () => {
    saveAndApply();
    btnSaveCustomProxy.textContent = '✓ Đã Áp Dụng Proxy!';
    setTimeout(() => {
      btnSaveCustomProxy.textContent = 'Áp Dụng Proxy Mới';
    }, 1500);
  });

  // Single 1-Click Master Connect Button Handler
  btnMasterConnect.addEventListener('click', () => {
    currentSettings.proxyEnabled = !currentSettings.proxyEnabled;
    saveAndApply();
  });
});
