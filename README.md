<h1>🚀 <strong>Webpack React Tailwind Template</strong></h1>
<p>✨ A modern and feature-rich template for developing React applications with <strong>Webpack</strong>, <strong>Tailwind CSS</strong>, and <a href="https://ui.shadcn.dev/"><strong>shadcn/ui</strong></a>.</p>

<hr />

<h2>🛠️ <strong>Features</strong></h2>
<ul>
  <li>⚛️ <strong>React 18</strong>: Build dynamic and interactive user interfaces.</li>
  <li>📦 <strong>Webpack 5</strong>: Modular and optimized bundling.</li>
  <li>🎨 <strong>Tailwind CSS</strong>: Utility-first styling with <code>tailwindcss-animate</code> for animations.</li>
  <li>🧩 <strong>Shadcn/UI</strong>: Pre-built UI components based on Radix UI primitives.</li>
  <li>🛡️ <strong>TypeScript</strong>: Type-safe development.</li>
  <li>🌐 <strong>Module Federation</strong>: Easily integrate microfrontends.</li>
  <li>🔒 <strong>Environment-based Configurations</strong>: Dynamic <code>.env</code> loading for <code>development</code>, <code>local</code>, and <code>production</code>.</li>
  <li>📊 <strong>Bundle Analysis</strong>: Visualize your bundle size in production mode.</li>
</ul>

<hr />

<h2>🚀 <strong>Getting Started</strong></h2>

<h3>📋 Prerequisites</h3>
<p>Ensure you have the following installed:</p>
<ul>
  <li>🟢 <strong>Node.js</strong> (v16 or newer)</li>
  <li>📦 <strong>npm</strong> or <strong>Yarn</strong></li>
</ul>

<h3>🧑‍💻 Installation</h3>
<ol>
  <li>
    <p><strong>Clone the repository:</strong></p>
    <pre><code>git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
</code></pre>
  </li>
  <li>
    <p><strong>Install dependencies:</strong></p>
    <pre><code>npm install
# or
yarn install
</code></pre>
  </li>
</ol>

<hr />

<h2>🛠️ <strong>Development</strong></h2>
<p>Start the development server:</p>
<pre><code>npm run dev
</code></pre>
<p>🌐 Your app will be live at <strong><code>http://localhost:3000</code></strong> with hot reloading.</p>

<hr />

<h2>📦 <strong>Build</strong></h2>

<h3>🏗️ Production</h3>
<p>Generate a production build:</p>
<pre><code>npm run build:prod
</code></pre>
<p>📂 The production-ready files will be output to the <code>dist</code> directory.</p>

<h3>🏡 Local Environment</h3>
<p>Generate a build for local testing:</p>
<pre><code>npm run build:local
</code></pre>

<hr />

<h2>🗂️ <strong>Project Structure</strong></h2>
<pre><code>├── src/                # 🚀 Application source code
│   ├── app/            # 🧩 Main application logic
│   ├── components/     # 🛠️ Reusable React components
│   └── index.ts        # 🏁 Entry point
├── public/             # 🌐 Static assets
├── dist/               # 📂 Production build output
├── webpack.config.js   # 🛠️ Webpack configuration
├── package.json        # 📦 Project metadata and dependencies
└── tailwind.config.js  # 🎨 Tailwind CSS configuration
</code></pre>

<hr />

<h2>🌍 <strong>Environment Variables</strong></h2>
<p>This project uses <code>.env</code> files for managing environment variables. Add <code>.env.development</code>, <code>.env.local</code>, and <code>.env.production</code> files as needed.</p>
<p>Example:</p>
<pre><code># 🌐 API Configuration
API_URL=https://api.example.com
PUBLIC_PATH=/
</code></pre>

<hr />

<h2>📜 <strong>Scripts</strong></h2>
<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>npm run dev</code></td>
      <td>🔧 Start the development server</td>
    </tr>
    <tr>
      <td><code>npm run build:prod</code></td>
      <td>🏗️ Build for production</td>
    </tr>
    <tr>
      <td><code>npm run build:local</code></td>
      <td>🏡 Build for local testing</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>📄 <strong>License</strong></h2>
<p>This project is licensed under the <strong><a href="LICENSE">ISC License</a></strong>.</p>

<hr />

<h2>💡 <strong>Contributing</strong></h2>
<p>Have ideas to improve this template? Feel free to fork the repository, make changes, and open a pull request. Contributions are always welcome! 💪</p>
