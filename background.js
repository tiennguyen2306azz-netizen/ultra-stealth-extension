// Ultra-Stealth Service Worker v12.2 - Smart Zero-Downtime Proxy Worker

const TOR_PAC_CONFIG = {
  mode: 'pac_script',
  pacScript: {
    data: `
      function FindProxyForURL(url, host) {
        if (isPlainHostName(host) || shExpMatch(host, '127.0.0.1') || shExpMatch(host, 'localhost') || shExpMatch(host, '*.local')) {
          return 'DIRECT';
        }
        return 'SOCKS5 127.0.0.1:9150; SOCKS5 127.0.0.1:9050; DIRECT';
      }
    `
  }
};

const DEFAULT_SETTINGS = {
  webrtcProtect: true,
  dnsPrivacyProtect: true,
  fingerprintProtect: true,
  timezoneSpoof: true,
  proxyEnabled: true,
  userAgentSpoof: true
};

// Initialize settings on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ stealthSettings: DEFAULT_SETTINGS }, () => {
    applySettings(DEFAULT_SETTINGS);
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'UPDATE_SETTINGS') {
    applySettings(request.settings);
    sendResponse({ status: 'SUCCESS' });
  } else if (request.action === 'GET_STATUS') {
    chrome.storage.local.get(['stealthSettings'], (res) => {
      sendResponse({ settings: res.stealthSettings || DEFAULT_SETTINGS });
    });
    return true;
  }
});

// Apply All Privacy & Proxy Policies
function applySettings(settings) {
  // 1. WebRTC IP Leak Shield (Strict Non-Proxied UDP Disable)
  if (chrome.privacy && chrome.privacy.network && chrome.privacy.network.webRTCIPHandlingPolicy) {
    const policy = settings.webrtcProtect ? 'disable_non_proxied_udp' : 'default';
    chrome.privacy.network.webRTCIPHandlingPolicy.set({ value: policy });
  }

  // 2. Anti-DNS Leak Shield
  if (chrome.privacy && chrome.privacy.network && chrome.privacy.network.networkPredictionEnabled) {
    chrome.privacy.network.networkPredictionEnabled.set({ value: !settings.dnsPrivacyProtect });
  }

  // 3. Disable Chrome Telemetry
  if (chrome.privacy && chrome.privacy.services) {
    if (chrome.privacy.services.alternateErrorPagesEnabled) {
      chrome.privacy.services.alternateErrorPagesEnabled.set({ value: false });
    }
    if (chrome.privacy.services.autofillEnabled) {
      chrome.privacy.services.autofillEnabled.set({ value: false });
    }
  }

  // 4. Smart Zero-Downtime Proxy (Auto-Fallback to DIRECT if Tor is offline)
  if (settings.proxyEnabled) {
    chrome.proxy.settings.set({ value: TOR_PAC_CONFIG, scope: 'regular' }, () => {
      console.log('[Ultra-Stealth v12.2] Smart Zero-Downtime Proxy ACTIVE (SOCKS5 9150 -> 9050 -> DIRECT)');
    });
  } else {
    chrome.proxy.settings.clear({ scope: 'regular' }, () => {
      console.log('[Ultra-Stealth v12.2] Direct Connection Active');
    });
  }

  // 5. User-Agent & Client Hints Overwrite
  if (settings.userAgentSpoof) {
    setupHeaderRules();
  } else {
    clearHeaderRules();
  }
}

function setupHeaderRules() {
  const targetUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
  const rule = {
    id: 1,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders: [
        { header: "User-Agent", operation: "set", value: targetUA },
        { header: "Sec-Ch-Ua", operation: "set", value: '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"' },
        { header: "Sec-Ch-Ua-Mobile", operation: "set", value: "?0" },
        { header: "Sec-Ch-Ua-Platform", operation: "set", value: '"Windows"' },
        { header: "Accept-Language", operation: "set", value: "en-US,en;q=0.9" }
      ]
    },
    condition: {
      urlFilter: "*",
      resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "xmlhttprequest", "ping", "other"]
    }
  };

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [rule]
  });
}

function clearHeaderRules() {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1]
  });
}
