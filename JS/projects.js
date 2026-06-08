document.addEventListener('DOMContentLoaded', () => {
    let projects = [];

    const fetchProjects = async () => {
        try {
            const response = await fetch('../../Config/projects.txt');
            const text = await response.text();
            return text.split('\n').map(line => line.trim()).filter(line => line);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    };

    // COMENTADO: geração de título, descrição e tags
    /*
    const fetchDescription = async () => {
        try {
            const response = await fetch('description.txt');
            const text = await response.text();
            const [title, description, tags] = text.split('---').map(line => line.trim());
            document.getElementById('project-title').textContent = title;
            document.title = title;
    
            const descriptionContainer = document.getElementById('project-description');
            const formattedDescription = convertUrlsToLinks(description);
    
            if (description.length > 420) {
                const shortDescription = formattedDescription.substring(0, 420);
                descriptionContainer.innerHTML = `${shortDescription}<span id="ellipsis">...</span><span id="full-description" style="display: none;">${formattedDescription.substring(420)}</span><br><span id="toggle-description">Read More</span>`;
    
                const toggleDescription = document.getElementById('toggle-description');
                const fullDescription = document.getElementById('full-description');
                const ellipsis = document.getElementById('ellipsis');
    
                toggleDescription.addEventListener('click', () => {
                    const isFullVisible = fullDescription.style.display === 'inline';
                    fullDescription.style.display = isFullVisible ? 'none' : 'inline';
                    ellipsis.style.display = isFullVisible ? 'inline' : 'none';
                    toggleDescription.textContent = isFullVisible ? 'Read More' : 'Read Less';
                });
            } else {
                descriptionContainer.innerHTML = formattedDescription;
            }
    
            renderTags(tags);
        } catch (error) {
            console.error('Error loading project description:', error);
        }
    };

    const convertUrlsToLinks = (text) => {
        const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
        return text.replace(urlPattern, (url) => {
            const truncatedUrl = new URL(url).hostname;
            return `<a href="${url}" target="_blank" class="link-button">${truncatedUrl}</a>`;
        });
    };
    
    const renderTags = (tags) => {
        const tagsContainer = document.getElementById('project-tags');
        tags.split(',').map(tag => tag.trim()).forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'software-tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
    };
    */

    // COMENTADO: geração de mídia (imagens, vídeos, etc.)
    /*
    const loadMedia = async () => {
        try {
            const response = await fetch('media.txt');
            const text = await response.text();
            const mediaContainer = document.getElementById('project-media');
            const lines = text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));

            const basePath = window.location.pathname.split('/').slice(0, -1).join('/') + '/';
            const fragment = document.createDocumentFragment();

            let i = 0;
            while (i < lines.length) {
                let description = '';
                let urls = [lines[i]];

                if (i + 1 < lines.length && !lines[i + 1].match(/\.(jpeg|jpg|gif|png|mp4|webm|mview)$/) && !lines[i + 1].includes('youtube.com') && !lines[i + 1].includes('sketchfab.com') && !lines[i + 1].includes(' // ') && !lines[i + 1].match(/^https?:\/\//)) {
                    description = lines[i + 1];
                    i += 1;
                }

                if (lines[i].includes(' // ')) {
                    urls = lines[i].split(' // ').map(url => url.trim());
                }

                urls = urls.map(url => (url.startsWith('http') ? url : basePath + url));

                if (description.includes('(marmoset viewer)')) {
                    urls = [`${urls[0]}.mview`];
                }

                const mediaElement = createMediaElement(urls, description);
                if (mediaElement) fragment.appendChild(mediaElement);
                i += 1;
            }

            mediaContainer.appendChild(fragment);
        } catch (error) {
            console.error('Error loading project media:', error);
        }
    };

    const createLinkButton = (url, description) => {
        const mediaElement = document.createElement('div');
        mediaElement.className = 'media-item store-buttons';

        const buttonText = description || 'Acessar Link';
        
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.className = 'store-button custom-link';
        link.innerHTML = `<i class="fas fa-external-link-alt"></i> ${buttonText}`;
        
        mediaElement.appendChild(link);
        return mediaElement;
    };

    const createMarmosetViewerElement = (url) => {
        const mediaElement = document.createElement('div');
        mediaElement.className = 'media-item marmoset-item';

        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.allow = 'autoplay; fullscreen';
        iframe.setAttribute('allowfullscreen', '');
        iframe.title = 'Marmoset Viewer';

        mediaElement.appendChild(iframe);
        return mediaElement;
    };

    const createMediaElement = (urls, description) => {
        let mediaElement;

        if (urls[0].match(/\.(jpeg|jpg|gif|png)$/) != null) {
            mediaElement = createImageElement(urls);
        } else if (urls[0].match(/\.(mp4|webm)$/) != null) {
            mediaElement = createVideoElement(urls[0]);
        } else if (urls[0].includes('youtube.com')) {
            mediaElement = createYouTubeElement(urls[0]);
        } else if (urls[0].includes('sketchfab.com')) {
            mediaElement = createSketchfabElement(urls[0]);
        } else if (urls[0].match(/^https?:\/\//)) {
            mediaElement = createLinkButton(urls[0], description);
        } else if (urls[0].match(/\.mview$/) != null) {
            mediaElement = createMarmosetViewerElement(urls[0]);
        }

        if (mediaElement && description && !urls[0].match(/^https?:\/\//)) {
            const descElement = document.createElement('p');
            descElement.className = 'media-description';
            descElement.textContent = description;
            mediaElement.appendChild(descElement);
        }

        return mediaElement;
    };

    const createImageElement = (urls) => {
        const mediaElement = document.createElement('div');
        mediaElement.className = 'media-item';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';

        const imgElement1 = document.createElement('img');
        imgElement1.src = urls[0];
        imgElement1.className = 'image-1';
        imgElement1.alt = 'Primary image';
        imgContainer.appendChild(imgElement1);

        if (urls[1]) {
            const imgElement2 = document.createElement('img');
            imgElement2.src = urls[1];
            imgElement2.className = 'image-2';
            imgElement2.alt = 'Secondary image';
            imgContainer.appendChild(imgElement2);

            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container';

            const sliderLine = document.createElement('div');
            sliderLine.className = 'slider-line';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '100';
            slider.value = '50';
            slider.className = 'image-slider';
            slider.setAttribute('aria-label', 'Image comparison slider');
            slider.addEventListener('input', () => {
                const value = slider.value;
                imgElement2.style.clipPath = `inset(0 0 0 ${value}%)`;
                sliderLine.style.left = `calc(${value}% - 1px)`;
            });

            sliderContainer.appendChild(sliderLine);
            sliderContainer.appendChild(slider);

            mediaElement.appendChild(imgContainer);
            mediaElement.appendChild(sliderContainer);
        } else {
            mediaElement.appendChild(imgContainer);
        }

        return mediaElement;
    };

    const createVideoElement = (url) => {
        const mediaElement = document.createElement('div');
        mediaElement.className = 'media-item';

        const videoElement = document.createElement('video');
        videoElement.src = url;
        videoElement.controls = true;
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true;
        videoElement.title = 'Video content';

        mediaElement.appendChild(videoElement);
        return mediaElement;
    };

    const createYouTubeElement = (url) => {
        const mediaElement = document.createElement('div');
        mediaElement.className = 'media-item responsive-iframe-container';

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${new URL(url).searchParams.get('v')}`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.title = 'YouTube video';

        mediaElement.appendChild(iframe);
        return mediaElement;
    };

    const createSketchfabElement = (url) => {
        const mediaElement = document.createElement('div');
        mediaElement.className = 'media-item responsive-iframe-container';

        const sketchfabId = url.split('/').pop().split('-').pop();
        const iframe = document.createElement('iframe');
        iframe.src = `https://sketchfab.com/models/${sketchfabId}/embed`;
        iframe.allow = 'autoplay; fullscreen; vr';
        iframe.allowFullscreen = true;
        iframe.title = 'Sketchfab model';

        mediaElement.appendChild(iframe);
        return mediaElement;
    };
    */

    // COMENTADO: geração de estatísticas
    /*
    const fetchStats = async () => {
        try {
            const response = await fetch('stats.txt');
            const text = await response.text();
            const lines = text.split('\n').map(line => line.trim()).filter(line => line);
            const statsContainer = document.getElementById('project-stats');
            // ... resto do código de stats comentado
        } catch (error) {
            console.error('Error loading project stats:', error);
        }
    };

    const positionTooltip = (event, tooltip) => {
        // ... código comentado
    };
    */

    // Navegação entre projetos (mantido)
    const navigateProjects = async (direction) => {
        const currentProject = window.location.pathname.split('/').slice(-2, -1)[0];
        const currentIndex = projects.indexOf(currentProject);

        if (currentIndex !== -1) {
            let newIndex = currentIndex + direction;
            if (newIndex < 0) newIndex = projects.length - 1;
            if (newIndex >= projects.length) newIndex = 0;

            const newProject = projects[newIndex];
            try {
                const response = await fetch(`../${newProject}/description.txt`);
                const text = await response.text();
                const htmlFileName = text.split('---')[4].trim();
                window.location.href = `../${newProject}/${htmlFileName}`;
            } catch (error) {
                console.error('Error loading next project description:', error);
            }
        }
    };

    // Back to Top Button Functionality (mantido)
    const backToTopButton = document.getElementById('back-to-top');
    const mediaContainer = document.querySelector('.media-container');
    if (mediaContainer) {
        mediaContainer.addEventListener('scroll', () => {
            if (backToTopButton) backToTopButton.style.display = mediaContainer.scrollTop > 1000 ? 'block' : 'none';
        });
    }

    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            if (mediaContainer) {
                mediaContainer.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Keyboard navigation (mantido)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            window.location.href = '../../index.html';
        } else if (event.key === 'ArrowLeft') {
            navigateProjects(-1);
        } else if (event.key === 'ArrowRight') {
            navigateProjects(1);
        } else if (event.key === 'ArrowUp') {
            if (mediaContainer) mediaContainer.scrollBy({ top: -200, behavior: 'smooth' });
        } else if (event.key === 'ArrowDown') {
            if (mediaContainer) mediaContainer.scrollBy({ top: 200, behavior: 'smooth' });
        }
    });

    // Initialize the app (apenas navegação)
    const init = async () => {
        projects = await fetchProjects();
        const prevButton = document.getElementById('prev-project');
        const nextButton = document.getElementById('next-project');
        if (prevButton) prevButton.addEventListener('click', () => navigateProjects(-1));
        if (nextButton) nextButton.addEventListener('click', () => navigateProjects(1));
        
        // Comentado: chamadas que geravam HTML
        // await fetchDescription();
        // await loadMedia();
        // await fetchStats();
    };

    init();
});