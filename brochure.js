// Brochure Generator Tool
function createBrochureTool() {
    return `
        <button class="back-btn" onclick="backToHome()">← Back to Tools</button>
        <h2>📄 Brochure Generator</h2>

        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; margin-bottom: 2rem;">

            <!-- Left Panel - Controls -->
            <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px; height: fit-content;">
                <h3 style="margin-bottom: 1rem;">Customize Your Brochure</h3>

                <!-- Template Selection -->
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Template:</label>
                    <select id="brochureTemplate" onchange="updateBrochurePreview()" style="width: 100%; padding: 0.5rem; border-radius: 6px; border: 2px solid var(--gray-200);">
                        <option value="trifold">Trifold Brochure</option>
                        <option value="bifold">Bifold Brochure</option>
                        <option value="flyer">Single Page Flyer</option>
                    </select>
                </div>

                <!-- Company/Title -->
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Company/Title:</label>
                    <input type="text" id="brochureTitle" placeholder="Your Company Name" onkeyup="updateBrochurePreview()" style="margin-bottom: 0;">
                </div>

                <!-- Tagline -->
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Tagline:</label>
                    <input type="text" id="brochureTagline" placeholder="Your tagline or slogan" onkeyup="updateBrochurePreview()" style="margin-bottom: 0;">
                </div>

                <!-- Main Content -->
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">About/Description:</label>
                    <textarea id="brochureAbout" rows="4" placeholder="Tell your story..." onkeyup="updateBrochurePreview()"></textarea>
                </div>

                <!-- Services/Features -->
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Features/Services (one per line):</label>
                    <textarea id="brochureFeatures" rows="4" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" onkeyup="updateBrochurePreview()"></textarea>
                </div>

                <!-- Contact Info -->
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Contact Info:</label>
                    <input type="text" id="brochureContact" placeholder="Email, Phone, Website" onkeyup="updateBrochurePreview()" style="margin-bottom: 0;">
                </div>

                <!-- Color Picker -->
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Primary Color:</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="color" id="brochureColor" value="#6366f1" onchange="updateBrochurePreview()" style="width: 60px; height: 40px; border: 2px solid var(--gray-200); border-radius: 6px; cursor: pointer;">
                        <input type="text" id="brochureColorHex" value="#6366f1" onchange="updateBrochureColorFromHex()" style="flex: 1; margin-bottom: 0;" placeholder="#6366f1">
                    </div>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <button class="btn-primary" onclick="downloadBrochure()">📥 Download as PDF</button>
                    <button class="btn-secondary" onclick="printBrochure()">🖨️ Print Brochure</button>
                    <button class="btn-secondary" onclick="resetBrochure()">🔄 Reset</button>
                </div>
            </div>

            <!-- Right Panel - Preview -->
            <div>
                <h3 style="margin-bottom: 1rem;">Preview</h3>
                <div id="brochurePreview" style="background: white; min-height: 500px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
                    <!-- Preview will be rendered here -->
                </div>
            </div>

        </div>

        <div class="ad-placeholder" style="margin-top: 2rem;">
            <small>💡 Premium: Unlock more templates, custom fonts, and logo upload!</small>
        </div>
    `;
}

let currentBrochureData = {
    template: 'trifold',
    title: 'Your Company Name',
    tagline: 'Making Your Business Better',
    about: 'We provide exceptional services to help your business grow and succeed in today\'s competitive market.',
    features: ['Professional Service', 'Expert Team', 'Quality Results', 'Customer Support'],
    contact: 'contact@yourcompany.com | (555) 123-4567',
    color: '#6366f1'
};

function initBrochure() {
    // Load saved data
    const saved = loadFromLocalStorage('brochureData');
    if (saved) {
        currentBrochureData = saved;
        document.getElementById('brochureTitle').value = saved.title;
        document.getElementById('brochureTagline').value = saved.tagline;
        document.getElementById('brochureAbout').value = saved.about;
        document.getElementById('brochureFeatures').value = saved.features.join('\n');
        document.getElementById('brochureContact').value = saved.contact;
        document.getElementById('brochureColor').value = saved.color;
        document.getElementById('brochureColorHex').value = saved.color;
        document.getElementById('brochureTemplate').value = saved.template;
    }

    updateBrochurePreview();
}

function updateBrochurePreview() {
    // Get current values
    currentBrochureData.template = document.getElementById('brochureTemplate').value;
    currentBrochureData.title = document.getElementById('brochureTitle').value || 'Your Company Name';
    currentBrochureData.tagline = document.getElementById('brochureTagline').value || 'Your tagline here';
    currentBrochureData.about = document.getElementById('brochureAbout').value || 'Tell your story here...';
    currentBrochureData.contact = document.getElementById('brochureContact').value || 'Your contact info';
    currentBrochureData.color = document.getElementById('brochureColor').value;

    const featuresText = document.getElementById('brochureFeatures').value;
    currentBrochureData.features = featuresText.split('\n').filter(f => f.trim().length > 0);

    // Update hex input
    document.getElementById('brochureColorHex').value = currentBrochureData.color;

    // Save to localStorage
    saveToLocalStorage('brochureData', currentBrochureData);

    // Render preview
    const preview = document.getElementById('brochurePreview');

    switch(currentBrochureData.template) {
        case 'trifold':
            preview.innerHTML = renderTrifold(currentBrochureData);
            break;
        case 'bifold':
            preview.innerHTML = renderBifold(currentBrochureData);
            break;
        case 'flyer':
            preview.innerHTML = renderFlyer(currentBrochureData);
            break;
    }
}

function updateBrochureColorFromHex() {
    const hex = document.getElementById('brochureColorHex').value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        document.getElementById('brochureColor').value = hex;
        updateBrochurePreview();
    }
}

function renderTrifold(data) {
    return `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); font-family: Arial, sans-serif;">
            <!-- Panel 1 -->
            <div style="background: ${data.color}; color: white; padding: 2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; min-height: 500px;">
                <h1 style="font-size: 2rem; margin-bottom: 1rem;">${data.title}</h1>
                <p style="font-size: 1.2rem; opacity: 0.9;">${data.tagline}</p>
            </div>

            <!-- Panel 2 -->
            <div style="padding: 2rem; background: #f9fafb; min-height: 500px;">
                <h2 style="color: ${data.color}; margin-bottom: 1rem;">About Us</h2>
                <p style="line-height: 1.6; color: #374151;">${data.about}</p>
                <div style="margin-top: 2rem;">
                    <h3 style="color: ${data.color}; margin-bottom: 0.5rem;">Contact Us</h3>
                    <p style="font-size: 0.9rem; color: #6b7280;">${data.contact}</p>
                </div>
            </div>

            <!-- Panel 3 -->
            <div style="padding: 2rem; min-height: 500px;">
                <h2 style="color: ${data.color}; margin-bottom: 1rem;">Our Services</h2>
                <ul style="list-style: none; padding: 0;">
                    ${data.features.map(f => `
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb; color: #374151;">
                            <span style="color: ${data.color};">✓</span> ${f}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;
}

function renderBifold(data) {
    return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; font-family: Arial, sans-serif;">
            <!-- Left Panel -->
            <div style="background: ${data.color}; color: white; padding: 3rem; min-height: 500px;">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">${data.title}</h1>
                <p style="font-size: 1.3rem; margin-bottom: 2rem; opacity: 0.9;">${data.tagline}</p>
                <div style="background: rgba(255,255,255,0.2); padding: 1.5rem; border-radius: 8px;">
                    <h3 style="margin-bottom: 1rem;">Why Choose Us?</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${data.features.map(f => `<li style="padding: 0.5rem 0;">✓ ${f}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <!-- Right Panel -->
            <div style="padding: 3rem; background: #f9fafb; min-height: 500px;">
                <h2 style="color: ${data.color}; margin-bottom: 1.5rem; font-size: 1.8rem;">About Us</h2>
                <p style="line-height: 1.8; color: #374151; margin-bottom: 2rem;">${data.about}</p>

                <div style="background: white; padding: 1.5rem; border-radius: 8px; border-left: 4px solid ${data.color};">
                    <h3 style="color: ${data.color}; margin-bottom: 1rem;">Get In Touch</h3>
                    <p style="color: #6b7280; line-height: 1.6;">${data.contact}</p>
                </div>
            </div>
        </div>
    `;
}

function renderFlyer(data) {
    return `
        <div style="font-family: Arial, sans-serif; min-height: 500px;">
            <!-- Header -->
            <div style="background: ${data.color}; color: white; padding: 3rem; text-align: center;">
                <h1 style="font-size: 3rem; margin-bottom: 0.5rem;">${data.title}</h1>
                <p style="font-size: 1.5rem; opacity: 0.9;">${data.tagline}</p>
            </div>

            <!-- Content -->
            <div style="padding: 2rem;">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h2 style="color: ${data.color}; margin-bottom: 1rem; font-size: 2rem;">About Us</h2>
                    <p style="line-height: 1.8; color: #374151; font-size: 1.1rem; margin-bottom: 2rem;">${data.about}</p>

                    <h2 style="color: ${data.color}; margin-bottom: 1rem; font-size: 2rem;">What We Offer</h2>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
                        ${data.features.map(f => `
                            <div style="background: #f9fafb; padding: 1.5rem; border-radius: 8px; border-left: 4px solid ${data.color};">
                                <span style="color: ${data.color}; font-weight: bold;">✓</span> ${f}
                            </div>
                        `).join('')}
                    </div>

                    <div style="background: ${data.color}; color: white; padding: 2rem; text-align: center; border-radius: 8px;">
                        <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Contact Us Today!</h3>
                        <p style="font-size: 1.1rem;">${data.contact}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function downloadBrochure() {
    showSuccessMessage('🚧 PDF download coming soon! Use Print for now.');
    // In premium version, this would use jsPDF or similar
    printBrochure();
}

function printBrochure() {
    const preview = document.getElementById('brochurePreview');
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${currentBrochureData.title} - Brochure</title>
            <style>
                body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
                @media print {
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            ${preview.innerHTML}
        </body>
        </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
        printWindow.print();
    }, 250);
}

function resetBrochure() {
    if (confirm('Reset brochure to defaults?')) {
        currentBrochureData = {
            template: 'trifold',
            title: 'Your Company Name',
            tagline: 'Making Your Business Better',
            about: 'We provide exceptional services to help your business grow and succeed in today\'s competitive market.',
            features: ['Professional Service', 'Expert Team', 'Quality Results', 'Customer Support'],
            contact: 'contact@yourcompany.com | (555) 123-4567',
            color: '#6366f1'
        };

        document.getElementById('brochureTitle').value = currentBrochureData.title;
        document.getElementById('brochureTagline').value = currentBrochureData.tagline;
        document.getElementById('brochureAbout').value = currentBrochureData.about;
        document.getElementById('brochureFeatures').value = currentBrochureData.features.join('\n');
        document.getElementById('brochureContact').value = currentBrochureData.contact;
        document.getElementById('brochureColor').value = currentBrochureData.color;
        document.getElementById('brochureColorHex').value = currentBrochureData.color;
        document.getElementById('brochureTemplate').value = currentBrochureData.template;

        localStorage.removeItem('brochureData');
        updateBrochurePreview();
    }
}
