window.onload = () => {
  fetch('elements.json')
    .then(res => res.json())
    .then(elements => {
      const container = document.getElementById('geo-content');
      elements.forEach(el => {
        const lat = el.latitude;
        const lon = el.longitude;
        if (el.model) {
          const modelEl = document.createElement('a-entity');
          modelEl.setAttribute('gps-entity-place', `latitude: ${lat}; longitude: ${lon}`);
          modelEl.setAttribute('gltf-model', `url(${el.model})`);
          modelEl.setAttribute('scale', '1 1 1');
          container.appendChild(modelEl);
        }
        if (el.video) {
          const videoId = `video-${lat}-${lon}`.replace(/[^a-zA-Z0-9_-]/g, '');
          const videoEl = document.createElement('video');
          videoEl.setAttribute('id', videoId);
          videoEl.setAttribute('src', el.video);
          videoEl.setAttribute('loop', true);
          videoEl.setAttribute('crossorigin', 'anonymous');
          videoEl.setAttribute('webkit-playsinline', '');
          videoEl.setAttribute('playsinline', '');
          videoEl.setAttribute('muted', true);
          videoEl.setAttribute('autoplay', true);
          document.body.appendChild(videoEl);
          const aVideo = document.createElement('a-video');
          aVideo.setAttribute('gps-entity-place', `latitude: ${lat}; longitude: ${lon}`);
          aVideo.setAttribute('src', `#${videoId}`);
          aVideo.setAttribute('width', '4');
          aVideo.setAttribute('height', '2');
          aVideo.setAttribute('position', '0 2 0');
          container.appendChild(aVideo);
        }
      });
    });
};
