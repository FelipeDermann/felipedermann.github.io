  const allImages = document.querySelectorAll('img');
  
  allImages.forEach(img => {
    if (img.width < 50 || img.height < 50) return;
    
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Cria o overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
      overlay.style.zIndex = '10000';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.cursor = 'zoom-out';
      
      const expandedImg = document.createElement('img');
      expandedImg.src = this.src;
      expandedImg.alt = this.alt;
      expandedImg.style.maxWidth = '90%';
      expandedImg.style.maxHeight = '90%';
      expandedImg.style.objectFit = 'contain';
      expandedImg.style.borderRadius = '8px';
      expandedImg.style.boxShadow = '0 0 50px rgba(0,0,0,0.8)';
      expandedImg.style.cursor = 'zoom-out';
      
      overlay.appendChild(expandedImg);
      
      overlay.addEventListener('click', function() {
        overlay.remove();
      });
      
      const closeOnEsc = function(e) {
        if (e.key === 'Escape') {
          overlay.remove();
          document.removeEventListener('keydown', closeOnEsc);
        }
      };
      document.addEventListener('keydown', closeOnEsc);
      document.body.appendChild(overlay);
    });
  });