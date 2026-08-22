const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- Starting build process ---');

const baseDir = __dirname;
const cssPath = path.join(baseDir, 'styles.css');
const minCssPath = path.join(baseDir, 'styles.min.css');
const jsPath = path.join(baseDir, 'script.js');
const minJsPath = path.join(baseDir, 'script.min.js');

try {
    // 1. Minify CSS
    console.log('Minifying styles.css -> styles.min.css...');
    execSync('npx -y clean-css-cli -o styles.min.css styles.css', { stdio: 'inherit', cwd: baseDir });
    console.log(`CSS Minified. Size: ${fs.statSync(cssPath).size} -> ${fs.statSync(minCssPath).size} bytes.`);

    // 2. Minify JS
    console.log('Minifying script.js -> script.min.js...');
    execSync('npx -y terser script.js -o script.min.js --compress --mangle', { stdio: 'inherit', cwd: baseDir });
    console.log(`JS Minified. Size: ${fs.statSync(jsPath).size} -> ${fs.statSync(minJsPath).size} bytes.`);

    // 3. Update index.html references
    const htmlPath = path.join(baseDir, 'index.html');
    if (fs.existsSync(htmlPath)) {
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        // Ensure index.html references minified assets
        if (htmlContent.includes('href="styles.css"')) {
            htmlContent = htmlContent.replace(/href="styles\.css"/g, 'href="styles.min.css"');
            console.log('Updated styles.css reference to styles.min.css in index.html');
        }
        if (htmlContent.includes('src="script.js"')) {
            htmlContent = htmlContent.replace(/src="script\.js"/g, 'src="script.min.js"');
            console.log('Updated script.js reference to script.min.js in index.html');
        }
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    }

    console.log('--- Build completed successfully! ---');
} catch (error) {
    console.error('Build failed during execution:', error);
    process.exit(1);
}
