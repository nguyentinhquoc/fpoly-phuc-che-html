
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    });
}

// Smooth scroll to section when clicking menu link
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only handle internal links starting with #
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate scroll position with offset for fixed navbar
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
        
        // Close menu after clicking
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
    });
});

// Smooth scroll for Go to Top button (logoZalo)
const logoZalo = document.getElementById('logoZalo');
if (logoZalo) {
    logoZalo.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navbar fade effect on scroll
const navbar = document.querySelector('nav');
let scrollTimeout;

window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Animation (AOS-like effect)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const aosType = entry.target.getAttribute('data-aos') || 'fade-up';
            entry.target.classList.add('aos-animate', aosType);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Toast notification function
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  
  toast.className = `fixed top-5 right-5 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-9999 flex items-center gap-3 animate-slideDown max-w-md`;
  toast.innerHTML = `<span class="text-xl font-bold">${icon}</span> <span class="flex-1">${message}</span>`;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideUp 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, type === 'success' ? 4000 : 5000);
}

const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get values
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const submitBtn = form.querySelector('button[type="submit"]');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate
  const errors = [];
  
  if (!name) errors.push("Vui lòng nhập họ và tên");
  else if (name.length < 3) errors.push("Họ và tên phải có ít nhất 3 ký tự");
  else if (name.length > 100) errors.push("Họ và tên không được vượt quá 100 ký tự");
  
  if (!email) errors.push("Vui lòng nhập email");
  else if (!emailRegex.test(email)) errors.push("Email không hợp lệ");
  
  if (!message) errors.push("Vui lòng nhập nội dung liên hệ");
  else if (message.length < 10) errors.push("Nội dung phải có ít nhất 10 ký tự");
  else if (message.length > 1000) errors.push("Nội dung không được vượt quá 1000 ký tự");

  if (errors.length > 0) {
    showToast(errors[0], 'error');
    return;
  }

  const data = {
    name: name,
    email: email,
    message: message,
    timestamp: new Date().toLocaleString('vi-VN')
  };

  try {
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="inline-block animate-spin">⟳</span> Đang gửi...';

    console.log("Sending data:", data);

    const res = await fetch("https://script.google.com/macros/s/AKfycbwCwLTBn7mY9B8kq69WICdTuC5C-eV4nX9yyLDi5r7DQm4Y-4hzVaZRAuq7QAyTCoGLOA/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    // Simulate delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Request sent successfully");
    
    // Show success toast
    showToast("Cảm ơn bạn đã liên hệ với chúng tôi.", 'success');
    
    form.reset();
    
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  } catch (err) {
    console.error("Error details:", err);
    showToast("Có lỗi xảy ra! Vui lòng thử lại sau.", 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Real-time validation
form.name.addEventListener("blur", () => {
  const value = form.name.value.trim();
  if (value && value.length < 3) {
    form.name.classList.add("border-red-500");
  } else {
    form.name.classList.remove("border-red-500");
  }
});

form.email.addEventListener("blur", () => {
  const value = form.email.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value && !emailRegex.test(value)) {
    form.email.classList.add("border-red-500");
  } else {
    form.email.classList.remove("border-red-500");
  }
});

form.message.addEventListener("blur", () => {
  const value = form.message.value.trim();
  if (value && value.length < 10) {
    form.message.classList.add("border-red-500");
  } else {
    form.message.classList.remove("border-red-500");
  }
});