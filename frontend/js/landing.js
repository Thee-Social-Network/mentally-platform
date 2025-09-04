// Landing Page JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link, .footer-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Mobile hamburger menu functionality
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navActions = document.querySelector('.nav-actions');
        
        if (hamburger && navMenu && navActions) {
            hamburger.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                navActions.classList.toggle('active');
                
                const icon = hamburger.querySelector('i');
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });
        }
    }

    // Navbar scroll effect
    function initNavbarScrollEffect() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(0, 45, 98, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.1)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
            
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // In your initButtonHandlers function in landing.js
function initButtonHandlers() {
    // Sign up buttons
    const signupButtons = [
        document.getElementById('signupBtn'),
        document.getElementById('ctaPrimary'),
        document.getElementById('finalCta')
    ];

    signupButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                // ✅ Redirect to signup page instead of dashboard
                window.location.href = '/signup';
            });
        }
    });

        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', function() {
                
        
                    // For demo, we'll redirect to dashboard
                    window.location.href = '/login';
                
            });
        }

        // Emergency button
        const emergencyBtn = document.getElementById('emergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', function() {
                showEmergencyModal();
            });
        }

        // Feature buttons
        const featureButtons = document.querySelectorAll('.feature-btn');
        featureButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const feature = this.dataset.feature;
                showFeatureModal(feature);
            });
        });

        // Tool buttons
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tool = this.dataset.tool;
                startTool(tool);
            });
        });

        // Community buttons
        const communityButtons = document.querySelectorAll('.community-btn');
        communityButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const community = this.dataset.community;
                joinCommunity(community);
            });
        });

        // Demo button
        const demoBtn = document.getElementById('ctaSecondary');
        if (demoBtn) {
            demoBtn.addEventListener('click', function() {
                showDemoModal();
            });
        }

        // Learn more button
        const learnMoreBtn = document.getElementById('learnMore');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', function() {
                document.getElementById('features').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }

    // Add loading state to buttons
    function addLoadingState(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;
        button.style.opacity = '0.7';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.opacity = '1';
        }, 3000);
    }

    // Emergency modal
    function showEmergencyModal() {
        const modal = createModal('Emergency Support', `
            <div style="text-align: center; padding: 2rem;">
                <div style="color: #DC3545; font-size: 3rem; margin-bottom: 1rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 style="color: #DC3545; margin-bottom: 1rem;">Crisis Support Available 24/7</h3>
                <p style="margin-bottom: 2rem; line-height: 1.6;">
                    If you're experiencing a mental health crisis or having thoughts of self-harm, 
                    please reach out for immediate help.
                </p>
                <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 300px; margin: 0 auto;">
                    <a href="tel:0800567567" style="background: #DC3545; color: white; padding: 1rem; border-radius: 25px; text-decoration: none; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-phone"></i> Call Crisis Hotline
                    </a>
                    <a href="tel:10177" style="background: #28A745; color: white; padding: 1rem; border-radius: 25px; text-decoration: none; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-ambulance"></i> Emergency Services
                    </a>
                    <button onclick="this.closest('.modal-overlay').remove()" style="background: transparent; border: 2px solid #FDBB30; color: #FDBB30; padding: 1rem; border-radius: 25px; font-weight: 600; cursor: pointer;">
                        I'm Safe - Close
                    </button>
                </div>
            </div>
        `);
        document.body.appendChild(modal);
    }

    // Feature modal
    function showFeatureModal(feature) {
        const featureContent = {
            ai: {
                title: 'AI-Powered Support',
                content: `
                    <div style="padding: 2rem;">
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <i class="fas fa-robot" style="font-size: 3rem; color: #FDBB30; margin-bottom: 1rem;"></i>
                            <h3 style="margin-bottom: 1rem;">24/7 AI Companion</h3>
                            <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                                Our AI provides instant emotional support, active listening, and personalized guidance. 
                                It's designed to be your first step toward healing, not a replacement for human connection.
                            </p>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Immediate emotional support</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Active listening and validation</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Personalized coping strategies</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Bridge to professional help</li>
                        </ul>
                        <button onclick="window.location.href='dashboard.html'" style="width: 100%; background: linear-gradient(45deg, #FDBB30, #FFD700); border: none; color: #002D62; padding: 1rem; border-radius: 25px; font-weight: 600; cursor: pointer;">
                            Try AI Support Now
                        </button>
                    </div>
                `
            },
            community: {
                title: 'Anonymous Community',
                content: `
                    <div style="padding: 2rem;">
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <i class="fas fa-user-friends" style="font-size: 3rem; color: #FDBB30; margin-bottom: 1rem;"></i>
                            <h3 style="margin-bottom: 1rem;">Safe Community Spaces</h3>
                            <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                                Connect with others who understand your journey in our supportive, anonymous community spaces.
                            </p>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Anonymous chat rooms</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Peer support groups</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Moderated discussions</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Local meetups</li>
                        </ul>
                        <button onclick="window.location.href='dashboard.html'" style="width: 100%; background: linear-gradient(45deg, #FDBB30, #FFD700); border: none; color: #002D62; padding: 1rem; border-radius: 25px; font-weight: 600; cursor: pointer;">
                            Join Community
                        </button>
                    </div>
                `
            },
            professionals: {
                title: 'Professional Connections',
                content: `
                    <div style="padding: 2rem;">
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <i class="fas fa-stethoscope" style="font-size: 3rem; color: #FDBB30; margin-bottom: 1rem;"></i>
                            <h3 style="margin-bottom: 1rem;">Qualified Mental Health Professionals</h3>
                            <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                                When you're ready for professional support, we connect you with licensed therapists and counselors.
                            </p>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Licensed therapists</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Specialized counselors</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Local professionals</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Insurance accepted</li>
                        </ul>
                        <button onclick="window.location.href='dashboard.html'" style="width: 100%; background: linear-gradient(45deg, #FDBB30, #FFD700); border: none; color: #002D62; padding: 1rem; border-radius: 25px; font-weight: 600; cursor: pointer;">
                            Find Professionals
                        </button>
                    </div>
                `
            },
            tracking: {
                title: 'Progress Tracking',
                content: `
                    <div style="padding: 2rem;">
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <i class="fas fa-chart-bar" style="font-size: 3rem; color: #FDBB30; margin-bottom: 1rem;"></i>
                            <h3 style="margin-bottom: 1rem;">Monitor Your Mental Health Journey</h3>
                            <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                                Track your mood, progress, and wellbeing with personalized insights and beautiful visualizations.
                            </p>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Daily mood tracking</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Progress visualizations</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Wellness streaks</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Personal insights</li>
                        </ul>
                        <button onclick="window.location.href='dashboard.html'" style="width: 100%; background: linear-gradient(45deg, #FDBB30, #FFD700); border: none; color: #002D62; padding: 1rem; border-radius: 25px; font-weight: 600; cursor: pointer;">
                            Start Tracking
                        </button>
                    </div>
                `
            },
            language: {
                title: 'Local Language Support',
                content: `
                    <div style="padding: 2rem;">
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <i class="fas fa-globe-africa" style="font-size: 3rem; color: #FDBB30; margin-bottom: 1rem;"></i>
                            <h3 style="margin-bottom: 1rem;">Culturally Sensitive Support</h3>
                            <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                                Get support in your native language with culturally appropriate guidance and resources.
                            </p>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Multiple South African languages</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Cultural sensitivity</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Local resources</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Community understanding</li>
                        </ul>
                        <button onclick="window.location.href='dashboard.html'" style="width: 100%; background: linear-gradient(45deg, #FDBB30, #FFD700); border: none; color: #002D62; padding: 1rem; border-radius: 25px; font-weight: 600; cursor: pointer;">
                            Choose Language
                        </button>
                    </div>
                `
            },
            emergency: {
                title: 'Emergency Support',
                content: `
                    <div style="padding: 2rem;">
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <i class="fas fa-shield-alt" style="font-size: 3rem; color: #DC3545; margin-bottom: 1rem;"></i>
                            <h3 style="margin-bottom: 1rem;">Immediate Crisis Support</h3>
                            <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                                Instant access to crisis hotlines and emergency services when you need them most.
                            </p>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> One-click emergency calls</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Crisis text lines</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> Local emergency services</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fas fa-check" style="color: #28A745; margin-right: 0.5rem;"></i> 24/7 availability</li>
                        </ul>
                        <div style="display: flex; gap: 1rem;">
                            <a href="tel:0800567567" style="flex: 1; background: #DC3545; color: white; padding: 1rem; border-radius: 25px; text-decoration: none; font-weight: 600; text-align: center;">
                                Call Crisis Line
                            </a>
                            <button onclick="this.closest('.modal-overlay').remove()" style="flex: 1; background: transparent; border: 2px solid #FDBB30; color: #FDBB30; padding: 1rem; border-radius: 25px; font-weight: 600; cursor: pointer;">
                                Close
                            </button>
                        </div>
                    </div>
                `
            }
        };

        const content = featureContent[feature];
        if (content) {
            const modal = createModal(content.title, content.content);
            document.body.appendChild(modal);
        }
    }

    // Demo modal
    function showDemoModal() {
        const modal = createModal('Platform Demo', `
            <div style="padding: 2rem; text-align: center;">
                <div style="margin-bottom: 2rem;">
                    <i class="fas fa-play-circle" style="font-size: 4rem; color: #FDBB30; margin-bottom: 1rem;"></i>
                    <h3 style="margin-bottom: 1rem;">See Mentaly in Action</h3>
                    <p style="color: rgba(255,255,255,0.8); line-height: 1.6; margin-bottom: 2rem;">
                        Experience how our platform can support your mental health journey with a guided demonstration.
                    </p>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 15px; padding: 1.5rem; margin-bottom: 2rem;">
                    <h4 style="margin-bottom: 1rem;">Demo Features:</h4>
                    <ul style="list-style: none; padding: 0; text-align: left;">
                        <li style="margin-bottom: 0.5rem;"><i class="fas fa-arrow-right" style="color: #FDBB30; margin-right: 0.5rem;"></i> AI conversation simulation</li>
                        <li style="margin-bottom: 0.5rem;"><i class="fas fa-arrow-right" style="color: #FDBB30; margin-right: 0.5rem;"></i> Mood tracking interface</li>
                        <li style="margin-bottom: 0.5rem;"><i class="fas fa-arrow-right" style="color: #FDBB30; margin-right: 0.5rem;"></i> Community features</li>
                        <li style="margin-bottom: 0.5rem;"><i class="fas fa-arrow-right" style="color: #FDBB30; margin-right: 0.5rem;"></i> Professional matching</li>
                    </ul>
                </div>
                <button onclick="window.location.href='dashboard.html'" style="width: 100%; background: linear-gradient(45deg, #FDBB30, #FFD700); border: none; color: #002D62; padding: 1rem; border-radius: 25px; font-weight: 600; cursor: pointer; margin-bottom: 1rem;">
                    Start Interactive Demo
                </button>
                <button onclick="this.closest('.modal-overlay').remove()" style="width: 100%; background: transparent; border: 2px solid #FDBB30; color: #FDBB30; padding: 1rem; border-radius: 25px; font-weight: 600; cursor: pointer;">
                    Maybe Later
                </button>
            </div>
        `);
        document.body.appendChild(modal);
    }

    // Tool functions
    function startTool(tool) {
        const toolActions = {
            breathing: () => {
                const modal = createModal('Breathing Exercise', `
                    <div style="padding: 2rem; text-align: center;">
                        <div style="margin-bottom: 2rem;">
                            <div id="breathingCircle" style="width: 150px; height: 150px; border: 3px solid #FDBB30; border-radius: 50%; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; animation: breathe 4s ease-in-out infinite;">
                                <span style="font-size: 1.2rem; font-weight: 600;">Breathe</span>
                            </div>
                            <h3 style="margin-bottom: 1rem;">4-7-8 Breathing Technique</h3>
                            <p id="breathingInstruction" style="color: rgba(255,255,255,0.8); font-size: 1.1rem; margin-bottom: 2rem;">
                                Inhale for 4 seconds...
                            </p>
                        </div>
                        <button onclick="this.closest('.modal-overlay').remove()" style="background: linear-gradient(45deg, #FDBB30, #FFD700); border: none; color: #002D62; padding: 1rem 2rem; border-radius: 25px; font-weight: 600; cursor: pointer;">
                            Complete Session
                        </button>
                    </div>
                `);
                document.body.appendChild(modal);
                startBreathingAnimation();
            },
            meditation: () => {
                window.location.href = 'dashboard.html#meditation';
            },
            journal: () => {
                window.location.href = 'dashboard.html#journal';
            }
        };

        if (toolActions[tool]) {
            toolActions[tool]();
        }
    }

    // Breathing animation
    function startBreathingAnimation() {
        const instruction = document.getElementById('breathingInstruction');
        if (!instruction) return;

        const phases = [
            { text: 'Inhale for 4 seconds...', duration: 4000 },
            { text: 'Hold for 7 seconds...', duration: 7000 },
            { text: 'Exhale for 8 seconds...', duration: 8000 }
        ];

        let currentPhase = 0;

        function nextPhase() {
            instruction.textContent = phases[currentPhase].text;
            setTimeout(() => {
                currentPhase = (currentPhase + 1) % phases.length;
                nextPhase();
            }, phases[currentPhase].duration);
        }

        nextPhase();
    }

    // Community functions
    function joinCommunity(type) {
        const communityActions = {
            chat: () => window.location.href = 'dashboard.html#community-chat',
            groups: () => window.location.href = 'dashboard.html#support-groups',
            peer: () => window.location.href = 'dashboard.html#peer-support'
        };

        if (communityActions[type]) {
            communityActions[type]();
        }
    }

    // Modal creation utility
    function createModal(title, content) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(10px);
            animation: fadeIn 0.3s ease-out;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: linear-gradient(135deg, #002D62, #00275D);
            border-radius: 24px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid rgba(253, 187, 48, 0.3);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.3s ease-out;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const titleEl = document.createElement('h2');
        titleEl.textContent = title;
        titleEl.style.cssText = `
            color: #FDBB30;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            color: #fff;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: background 0.3s ease;
        `;

        closeBtn.onclick = () => modalOverlay.remove();
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) modalOverlay.remove();
        };

        const contentEl = document.createElement('div');
        contentEl.innerHTML = content;

        header.appendChild(titleEl);
        header.appendChild(closeBtn);
        modal.appendChild(header);
        modal.appendChild(contentEl);
        modalOverlay.appendChild(modal);

        return modalOverlay;
    }

    // Intersection Observer for animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll('.feature-card, .tool-card, .community-card');
        animatedElements.forEach(el => {
            el.style.animation = 'fadeInUp 0.8s ease-out forwards';
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    // Parallax effect for hero section
    function initParallaxEffect() {
        const heroVisual = document.querySelector('.hero-visual');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Add custom styles for animations
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .animate-in {
                animation-play-state: running !important;
            }
            
            @media (max-width: 768px) {
                .nav-menu.active,
                .nav-actions.active {
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: rgba(0, 45, 98, 0.95);
                    backdrop-filter: blur(20px);
                    padding: 2rem;
                    gap: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    animation: slideDown 0.3s ease-out;
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize all functionality
    function init() {
        initSmoothScrolling();
        initMobileMenu();
        initNavbarScrollEffect();
        initButtonHandlers();
        initScrollAnimations();
        initParallaxEffect();
        addCustomStyles();
    }

    // Start the application
    init();

    // Add loading screen fade out
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
});