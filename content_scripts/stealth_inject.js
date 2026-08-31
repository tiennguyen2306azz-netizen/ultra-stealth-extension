// Ultra-Stealth Engine v10.0: Global Apex Edition (CreepJS & FingerprintJS v4 Bypass)
(function () {
  'use strict';

  const sessionSeed = Math.floor(Math.random() * 100000) + 1;

  function getRandomFloatNoise() {
    return (Math.random() - 0.5) * 0.00001;
  }

  // Helper to make overridden functions appear 100% [native code]
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
        Object.defineProperty(fn, 'name', { value: name, configurable: true });
      } catch (e) {}
    }
    overriddenFns.add(fn);
    return fn;
  }

  // -------------------------------------------------------------
  // 1. WEBRTC HARD STUN & ICE CANDIDATE BLOCK
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
  // 2. CANVAS & OFFSCREENCANVAS SUBPIXEL JITTER
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
            return target.width + (sessionSeed % 2 === 0 ? 0.00003 : -0.00003);
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
  // 3. WEBGL & WEBGL2 PARAMETER & READPIXELS SPOOFING
  // -------------------------------------------------------------
  try {
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
  } catch (e) {}

  // -------------------------------------------------------------
  // 4. AUDIOCONTEXT & SPEECH SYNTHESIS SPOOFING
  // -------------------------------------------------------------
  try {
    if (window.AudioBuffer) {
      const originalGetChannelData = AudioBuffer.prototype.getChannelData;
      AudioBuffer.prototype.getChannelData = markNative(function () {
        const channelData = originalGetChannelData.apply(this, arguments);
        for (let i = 0; i < channelData.length; i += 60) {
          channelData[i] += getRandomFloatNoise();
        }
        return channelData;
      }, 'getChannelData');
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices = markNative(() => [], 'getVoices');
    }
  } catch (e) {}

  // -------------------------------------------------------------
  // 5. PERFORMANCE TIMING JITTER (SIDE-CHANNEL ATTACK PROTECTION)
  // -------------------------------------------------------------
  try {
    if (window.performance && window.performance.now) {
      const originalNow = window.performance.now;
      window.performance.now = markNative(function () {
        return originalNow.apply(this, arguments) + getRandomFloatNoise();
      }, 'now');
    }
  } catch (e) {}

  // -------------------------------------------------------------
  // 6. MEDIADEVICES & HARDWARE SPOOFING
  // -------------------------------------------------------------
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices = markNative(() => Promise.resolve([
        { deviceId: "default", kind: "audioinput", label: "Default Microphone", groupId: "group_audio" },
        { deviceId: "default", kind: "videoinput", label: "Integrated HD Camera", groupId: "group_video" },
        { deviceId: "default", kind: "audiooutput", label: "Default Speakers", groupId: "group_output" }
      ]), 'enumerateDevices');
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
          get: valueGetter,
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

    defineProp(navigator, 'connection', () => ({
      downlink: 10,
      effectiveType: '4g',
      rtt: 50,
      saveData: false
    }));

    if (navigator.getBattery) {
      navigator.getBattery = markNative(() => Promise.resolve({
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1.0
      }), 'getBattery');
    }
  } catch (e) {}

  console.log('🛡️ [Ultra-Stealth Engine v10.0 Global Apex] Fully Shielded & Native Disguised');
})();
