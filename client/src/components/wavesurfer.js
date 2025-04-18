const renderMessageContent = (msg) => {
    switch (msg.contentType) {
      case 'text':
        return <p className="mb-0 whitespace-pre-wrap">{msg.content}</p>;
      case 'image':
        return <img src={msg.content} alt="Shared" className="max-w-[200px] rounded-lg shadow" />;
      case 'voice':
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-32 h-10"
              ref={(el) => {
                if (el && !el.waveform) {
                  const WaveSurfer = require('wavesurfer.js');
                  el.waveform = WaveSurfer.create({
                    container: el,
                    waveColor: '#4B5EAA',
                    progressColor: '#2A3F7B',
                    height: 40,
                    barWidth: 2,
                    cursorWidth: 0,
                    responsive: true
                  });
                  el.waveform.load(msg.content);
                  el.waveform.on('click', () => el.waveform.playPause());
                }
              }}
            ></div>
            <span className="text-xs text-gray-500">{formatTimestamp(msg.timestamp)}</span>
          </div>
        );
      default:
        return null;
    }
  };