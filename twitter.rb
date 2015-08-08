require 'twitter'

client = Twitter::Streaming::Client.new do |config|
  config.consumer_key        = "SECRET"
  config.consumer_secret     = "SECRET"
  config.access_token        = "SECRET"
  config.access_token_secret = "SECRET"
end

@counter = 0
@coordinate_counter = 0

client.filter(track: "fleek") do |object|
  puts "#{object.user.screen_name}: #{object.text}"
  @counter += 1
  puts "Tweets: #{@counter}!"
  if "#{object.place}" == ""
    p "#{object.user.location}"
  else
    puts "#{object.place}"
    puts "#{object.place.bounding_box.coordinates}"
    @coordinate_counter += 1
  end
  break if @counter > 5
end

@odds = (@counter.to_f)/(@coordinate_counter.to_f)
puts "Out of #{@counter} tweets, we were able to grab #{@coordinate_counter} coordinates, or #{@odds*100}% coordinate grabs!"
