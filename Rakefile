namespace :chrome do
  desc 'build chrome zip file'
  task :zip do
    puts 'building zip for chrome...'
    sh %{ zip -r chrome-github-mate.zip _locales/ style.css script.js manifest.json icon.png background.js background.html icon.png }
    puts 'build done.'
  end
end

task default: 'chrome:zip'

