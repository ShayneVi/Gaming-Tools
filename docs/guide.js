// ============================================
// GAMING GUIDE - GOLDBERG & NUCLEUS
// JavaScript functionality
// ============================================

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Gaming Guide initialized');

    // Setup navbar scroll effect
    setupNavbar();

    // Setup smooth scrolling for all anchor links
    setupSmoothScroll();

    // Setup active TOC highlighting
    setupTOCHighlight();

    // Log page load
    console.log('✓ Gaming Guide loaded successfully');
});

// Navbar scroll effect
function setupNavbar() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Setup smooth scrolling for all anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just '#'
            if (href === '#') return;

            e.preventDefault();

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// Setup TOC active highlighting based on scroll position
function setupTOCHighlight() {
    const tocLinks = document.querySelectorAll('.toc-nav a');
    const sections = document.querySelectorAll('.article[id], .section[id]');

    if (tocLinks.length === 0 || sections.length === 0) return;

    // Observe sections
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -66%',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Remove active class from all TOC links
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    link.style.background = '';
                    link.style.color = '';
                });

                // Add active class to current TOC link
                const activeLink = document.querySelector(`.toc-nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLink.style.background = 'var(--bg-light)';
                    activeLink.style.color = 'var(--primary-light)';
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Copy code to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
            showToast('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            console.log('Copied to clipboard (fallback):', text);
            showToast('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy (fallback):', err);
        }
        document.body.removeChild(textArea);
    }
}

// Show toast notification
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
        font-weight: 500;
    `;

    document.body.appendChild(toast);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Add copy buttons to code blocks
function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.code-block');

    codeBlocks.forEach(block => {
        // Skip if button already exists
        if (block.querySelector('.copy-btn')) return;

        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = '📋 Copy';
        button.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--primary);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
            transition: background 0.2s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.background = 'var(--primary-light)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = 'var(--primary)';
        });

        button.addEventListener('click', () => {
            const code = block.querySelector('pre').textContent;
            copyToClipboard(code);
            button.innerHTML = '✓ Copied!';
            setTimeout(() => {
                button.innerHTML = '📋 Copy';
            }, 2000);
        });

        block.style.position = 'relative';
        block.appendChild(button);
    });
}

// Call this after DOM is loaded
setTimeout(addCopyButtonsToCodeBlocks, 500);

// Print guide
function printGuide() {
    window.print();
}

// Search functionality (optional enhancement)
function searchGuide(query) {
    if (!query || query.trim() === '') {
        console.log('Empty search query');
        return;
    }

    query = query.toLowerCase().trim();
    console.log('Searching guide for:', query);

    const articles = document.querySelectorAll('.article');
    let results = [];

    articles.forEach(article => {
        const text = article.textContent.toLowerCase();
        if (text.includes(query)) {
            const title = article.querySelector('h2, h3');
            if (title) {
                results.push({
                    title: title.textContent,
                    element: article,
                    id: article.id
                });
            }
        }
    });

    console.log(`Found ${results.length} results for "${query}"`);

    if (results.length > 0) {
        // Scroll to first result
        results[0].element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Highlight the result temporarily
        results[0].element.style.background = 'rgba(102, 126, 234, 0.1)';
        setTimeout(() => {
            results[0].element.style.background = '';
        }, 2000);
    }

    return results;
}

// Toggle checklist items
document.addEventListener('click', (e) => {
    if (e.target.type === 'checkbox' && e.target.closest('.checklist')) {
        const label = e.target.closest('label');
        if (label && e.target.checked) {
            label.style.opacity = '0.6';
            label.style.textDecoration = 'line-through';
        } else if (label) {
            label.style.opacity = '1';
            label.style.textDecoration = 'none';
        }
    }
});

// Console info
console.log('%c🎮 Gaming Guide - Goldberg & Nucleus Coop', 'font-size: 16px; font-weight: bold; color: #667eea;');
console.log('Guide includes:');
console.log('• Goldberg Steam Emulator setup');
console.log('• ZeroTier VLAN configuration');
console.log('• Nucleus Coop split-screen gaming');
console.log('• Comprehensive troubleshooting');

// Utility: Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animate elements when they come into view (optional)
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.step-box, .info-box, .concept-box');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.5s ease forwards';
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        animationObserver.observe(el);
    });

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Call scroll animations after a short delay
setTimeout(setupScrollAnimations, 1000);

// Handle URL hash on page load
window.addEventListener('load', () => {
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
});

// Export functions for external use
window.guideUtils = {
    scrollToSection,
    copyToClipboard,
    searchGuide,
    printGuide
};
