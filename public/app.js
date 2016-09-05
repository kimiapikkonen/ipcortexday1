function onAPILoadReady(){

  IPCortex.PBX.Auth.login()
    .then(IPCortex.PBX.startFeed)
    .then(()=>{
      IPCortex.PBX.enableChat()
      IPCortex.PBX.enableFeature('av', handleStream, ['chat'])
      IPCortex.Types.Room.addListener('new', roomCreateEventListener) 
      IPCortex.PBX.contacts.forEach((el)=>{
        if(el.uname === 'gate-a'){ el.chat()}
        if(el.uname === 'gate-b'){ el.chat()}
        if(el.uname === 'gate-c'){ el.chat()}
      })
    })
    function roomCreateEventListener(el){
      navigator.mediaDevices.getUserMedia({
        audio:true,
        video:true
      })
      .then( el.videoChat).then((el)=>{el.addListener('update', processFeed)})
    } 
}

function handleStream(av){
  //av.addListener('update', processFeed)
}

function processFeed(av){
  var feed = document.getElementById(av.id);
  var videos = [];

  for ( var id in av.remoteMedia ) {
    console.log(av.remoteMedia[id].status)
    var video = document.getElementById(id);

    if ( av.remoteMedia[id].status == 'offered' ) {
      /* Accept remote parties offer */
    console.log('Accepting offer ' + av.remoteMedia[id].cN)

    } else if ( av.remoteMedia[id].status == 'connected' && !video ) {

      /* Create a new video tag to play/display the remote media */
    video = document.createElement('video');
    attachMediaStream(video, av.remoteMedia[id]);
    videos.push(video);
    video.id = id;
    video.play();
    } else if ( av.remoteMedia[id].status != 'connected' && video ) {
      console.log('you are connected')
        /* Remove any video tags that are no longer in a 'connected' state */
    }
  }

  if ( videos.length && ! feed ) {
    feed = document.createElement('div');
    document.body.appendChild(feed);
    feed.className = 'feed';
    feed.id = av.id;
  }
  videos.forEach(
    function(video) {
      feed.appendChild(video);
      tracking.track(`#${video.id}`, objects);
    }
  );
  /* Remove the feed container if empty */
if ( feed && feed.children.length < 1 )
  feed.parentNode.removeChild(feed);
}
var results = []
var objects = new tracking.ColorTracker(['yellow']);

objects.on('track', function(event) {
  if (event.data.length === 0) {
    // No colors were detected in this frame.
  } else {
    event.data.forEach(function(rect) {
      console.log(rect)
      console.log(rect.x, rect.y, rect.height, rect.width);
    });
  }
});

if ( feed && feed.children.length < 1 )
  feed.parentNode.removeChild(feed);

