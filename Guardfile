guard 'coffeescript', :output => 'javascripts' do
  watch('^app/coffeescripts/(.*)\.coffee')
end

guard 'coffeescript', :output => 'spec/javascripts' do
  watch('^spec/coffeescripts/(.*)\.coffee')
end

guard 'livereload' do
  watch('^spec/javascripts/.+\.js$')
  watch('^javascripts/.+\.js$')
end
