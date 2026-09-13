// Ultra-Stealth Engine v13.0: Anti-Bot Defense & Stealth Bypass Architecture
(function () {
  'use strict';

  // Domain-isolated session seed
  const domainHash = Array.from(window.location.hostname || 'default')
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000, 7);
  const sessionSeed = domainHash + Math.floor(Math.random() * 1000) + 1;

  function getRandomFloatNoise() {
    return (Math.random() - 0.5) * 0.000005;
  }

  // Robust Native Function Masking Helper
  const nativeToString = Function.prototype.toString;
  const overriddenFns = new Set();
  
  Function.prototype.toString = function () {
    if (overriddenFns.has(this)) {
      return `function ${this.name || ''}() { [native code] }`;
    }
    return nativeToString.apply(this, arguments);
  };
  overriddenFns.add(Function.prototype.toString);

  function markNative(fn, name) {
    if (name) {
      try {
        Object.defineProperty(fn, 'name', { value: name, configurable: true, writable: false });
      } catch (e) {}
    }
    try {
      Object.defineProperty(fn, 'toString', {
        value: markNative(function toString() {
          return `function ${name || fn.name || ''}() { [native code] }`;
        }, 'toString'),
        configurable: true,
        writable: true
      });
    } catch (e) {}
    overriddenFns.add(fn);
    return fn;
  }

  // -------------------------------------------------------------
  // 1. AUTOMATION DETECTION ELIMINATION (cdc_ & webdriver)
  // -------------------------------------------------------------
  try {
    const defineProp = (obj, prop, valueGetter) => {
      try {
        Object.defineProperty(obj, prop, {
          get: markNative(valueGetter, prop),
          configurable: true,
          enumerable: true
        });
      } catch (e) {}
    };

    defineProp(navigator, 'webdriver', () => undefined);
    
    // Remove automation window properties
    delete window.cdc_adoQbx101705_Array;
    delete window.cdc_adoQbx101705_Promise;
    delete window.cdc_adoQbx101705_Symbol;
    
    // Disguise chrome runtime / automation flags
    if (!window.chrome) {
      window.chrome = {};
    }
    if (!window.chrome.runtime) {
      window.chrome.runtime = {
        connect: markNative(() => {}, 'connect'),
        sendMessage: markNative(() => {}, 'sendMessage')
      };
    }
  } catch (e) {}

  // -------------------------------------------------------------
  // 2. HUMANIZED PERMISSION & CHROME PLUGIN MASKING
  // -------------------------------------------------------------
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const originalQuery = navigator.permissions.query;
      navigator.permissions.query = markNative(function (parameters) {
        if (parameters && parameters.name === 'notifications') {
          return Promise.resolve({ state: Notification.permission || 'default', onchange: null });
        }
        return originalQuery.apply(this, arguments);
      }, 'query');
    }

    // Spoof realistic Plugins array
    const fakePlugins = [
      { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
      { name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
      { name: 'Chromium PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' }
    ];
    Object.defineProperty(navigator, 'plugins', {
      get: markNative(() => fakePlugins, 'plugins'),
      configurable: true,
      enumerable: true
    });
  } catch (e) {}

  // -------------------------------------------------------------
  // 3. WEBRTC STUN BLOCKING
  // -------------------------------------------------------------
  try {
    if (window.RTCPeerConnection) {
      const originalRTC = window.RTCPeerConnection;
      const rtcWrapper = function (config, constraints) {
        if (config && config.iceServers) {
          config.iceServers = [];
        }
        const pc = new originalRTC(config, constraints);
        const originalAddIceCandidate = pc.addIceCandidate;
        pc.addIceCandidate = markNative(function (candidate) {
          if (candidate && candidate.candidate && candidate.candidate.includes('typ host')) {
            return Promise.resolve();
          }
          return originalAddIceCandidate.apply(this, arguments);
        }, 'addIceCandidate');
        return pc;
      };
      rtcWrapper.prototype = originalRTC.prototype;
      window.RTCPeerConnection = markNative(rtcWrapper, 'RTCPeerConnection');
    }
  } catch (e) {}

  // -------------------------------------------------------------
  // 4. DOMAIN-ISOLATED CANVAS & FONT ENUMERATION SHIELD
  // -------------------------------------------------------------
  try {
    const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = markNative(function (x, y, w, h, settings) {
      const imageData = originalGetImageData.apply(this, arguments);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 12) {
        if (data[i + 3] > 0) {
          data[i] = Math.min(255, Math.max(0, data[i] + (sessionSeed % 2 === 0 ? 1 : -1)));
        }
      }
      return imageData;
    }, 'getImageData');

    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = markNative(function (type, encoderOptions) {
      const ctx = this.getContext('2d');
      if (ctx) {
        try {
          const imgData = ctx.getImageData(0, 0, Math.min(this.width || 10, 10), Math.min(this.height || 10, 10));
          ctx.putImageData(imgData, 0, 0);
        } catch (e) {}
      }
      return originalToDataURL.apply(this, arguments);
    }, 'toDataURL');

    const originalMeasureText = CanvasRenderingContext2D.prototype.measureText;
    CanvasRenderingContext2D.prototype.measureText = markNative(function (text) {
      const metrics = originalMeasureText.apply(this, arguments);
      return new Proxy(metrics, {
        get(target, prop) {
          if (prop === 'width') {
            return target.width + (sessionSeed % 2 === 0 ? 0.00002 : -0.00002);
          }
          return target[prop];
        }
      });
    }, 'measureText');

    if (window.OffscreenCanvas) {
      const originalConvertToBlob = OffscreenCanvas.prototype.convertToBlob;
      if (originalConvertToBlob) {
        OffscreenCanvas.prototype.convertToBlob = markNative(function () {
          const ctx = this.getContext('2d');
          if (ctx) {
            try {
              const imgData = ctx.getImageData(0, 0, Math.min(this.width || 10, 10), Math.min(this.height || 10, 10));
              ctx.putImageData(imgData, 0, 0);
            } catch (e) {}
          }
          return originalConvertToBlob.apply(this, arguments);
        }, 'convertToBlob');
      }
    }
  } catch (e) {}

  // -------------------------------------------------------------
  // 5. LAYOUT CLIENTRECTS MICRO-JITTER
  // -------------------------------------------------------------
  try {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = markNative(function () {
      const rect = originalGetBoundingClientRect.apply(this, arguments);
      const jitter = sessionSeed % 2 === 0 ? 0.00001 : -0.00001;
      return new DOMRect(
        rect.x + jitter,
        rect.y + jitter,
        rect.width + jitter,
        rect.height + jitter
      );
    }, 'getBoundingClientRect');

    const originalGetClientRects = Element.prototype.getClientRects;
    Element.prototype.getClientRects = markNative(function () {
      const rects = originalGetClientRects.apply(this, arguments);
      const list = [];
      const jitter = sessionSeed % 2 === 0 ? 0.00001 : -0.00001;
      for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
        list.push(new DOMRect(r.x + jitter, r.y + jitter, r.width + jitter, r.height + jitter));
      }
      return list;
    }, 'getClientRects');
  } catch (e) {}

  // -------------------------------------------------------------
  // 6. GAMEPAD & WEBGPU / WEBGL SPOOFING
  // -------------------------------------------------------------
  try {
    if (navigator.getGamepads) {
      navigator.getGamepads = markNative(function () {
        return [];
      }, 'getGamepads');
    }

    const webGLVendor = 'Google Inc. (NVIDIA)';
    const webGLRenderer = 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)';

    const overrideWebGL = function (targetPrototype) {
      const originalGetParameter = targetPrototype.getParameter;
      targetPrototype.getParameter = markNative(function (parameter) {
        if (parameter === 37445) return webGLVendor;     // UNMASKED_VENDOR_WEBGL
        if (parameter === 37446) return webGLRenderer;   // UNMASKED_RENDERER_WEBGL
        if (parameter === 3379) return 16384;             // MAX_TEXTURE_SIZE
        if (parameter === 34076) return 16384;            // MAX_CUBE_MAP_TEXTURE_SIZE
        return originalGetParameter.apply(this, arguments);
      }, 'getParameter');

      const originalReadPixels = targetPrototype.readPixels;
      targetPrototype.readPixels = markNative(function (x, y, width, height, format, type, pixels) {
        originalReadPixels.apply(this, arguments);
        if (pixels && pixels.length) {
          for (let i = 0; i < pixels.length; i += 16) {
            pixels[i] = Math.min(255, Math.max(0, pixels[i] + (sessionSeed % 2 === 0 ? 1 : -1)));
          }
        }
      }, 'readPixels');
    };

    if (window.WebGLRenderingContext) overrideWebGL(WebGLRenderingContext.prototype);
    if (window.WebGL2RenderingContext) overrideWebGL(WebGL2RenderingContext.prototype);

    if (navigator.gpu && navigator.gpu.requestAdapter) {
      const originalRequestAdapter = navigator.gpu.requestAdapter;
      navigator.gpu.requestAdapter = markNative(function () {
        return originalRequestAdapter.apply(this, arguments).then(adapter => {
          if (!adapter) return null;
          return new Proxy(adapter, {
            get(target, prop) {
              if (prop === 'name') return 'NVIDIA GeForce RTX 3060';
              return target[prop];
            }
          });
        });
      }, 'requestAdapter');
    }
  } catch (e) {}

  // -------------------------------------------------------------
  // 7. TIMEZONE & LOCALE SYNCHRONIZATION ENGINE (US / UTC)
  // -------------------------------------------------------------
  try {
    const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
    Intl.DateTimeFormat.prototype.resolvedOptions = markNative(function () {
      const options = originalResolvedOptions.apply(this, arguments);
      options.timeZone = 'America/New_York';
      options.locale = 'en-US';
      return options;
    }, 'resolvedOptions');

    Date.prototype.getTimezoneOffset = markNative(function () {
      return 300;
    }, 'getTimezoneOffset');
  } catch (e) {}

  // -------------------------------------------------------------
  // 8. PRIVACY HEADERS & HARDWARE STANDARDIZATION
  // -------------------------------------------------------------
  try {
    const defineProp = (obj, prop, valueGetter) => {
      try {
        Object.defineProperty(obj, prop, {
          get: markNative(valueGetter, prop),
          configurable: true,
          enumerable: true
        });
      } catch (e) {}
    };

    defineProp(navigator, 'doNotTrack', () => '1');
    defineProp(navigator, 'globalPrivacyControl', () => true);
    defineProp(navigator, 'hardwareConcurrency', () => 8);
    defineProp(navigator, 'deviceMemory', () => 8);
    defineProp(navigator, 'platform', () => 'Win32');
    defineProp(navigator, 'languages', () => ['en-US', 'en']);
    defineProp(navigator, 'language', () => 'en-US');
    defineProp(navigator, 'maxTouchPoints', () => 0);

    defineProp(screen, 'width', () => 1920);
    defineProp(screen, 'height', () => 1080);
    defineProp(screen, 'availWidth', () => 1920);
    defineProp(screen, 'availHeight', () => 1040);
    defineProp(screen, 'colorDepth', () => 24);
    defineProp(screen, 'pixelDepth', () => 24);
  } catch (e) {}

  console.log('🛡️ [Ultra-Stealth Engine v13.0 Anti-Bot Defense] Operational & Fully Humanized');
})();
