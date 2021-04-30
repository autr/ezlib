module.exports = [{"name":"bitrate","desc":"Set bitrate. Use bits per second (e.g. 10MBits/s would be -b 10000000)","type":"boolean"},{"name":"timeout","desc":"Time (in ms) to capture for. If not specified, set to 5s. Zero to disable","type":"boolean"},{"name":"demo","desc":"Run a demo mode (cycle through range of camera options, no capture)","type":"boolean"},{"name":"framerate","desc":"Specify the frames per second to record","type":"boolean"},{"name":"penc","desc":"Display preview image *after* encoding (shows compression artifacts)","type":"boolean"},{"name":"intra","desc":"Specify the intra refresh period (key frame rate/GoP size). Zero to produce an initial I-frame and then just P-frames.","type":"boolean"},{"name":"profile","desc":"Specify H264 profile to use for encoding","type":"boolean"},{"name":"timed","desc":"Cycle between capture and pause. -cycle on,off where on is record time and off is pause time in ms","type":"boolean"},{"name":"signal","desc":"Cycle between capture and pause on Signal","type":"boolean"},{"name":"keypress","desc":"Cycle between capture and pause on ENTER","type":"boolean"},{"name":"initial","desc":"Initial state. Use 'record' or 'pause'. Default 'record'","type":"boolean"},{"name":"qp","desc":"Quantisation parameter. Use approximately 10-40. Default 0 (off)","type":"boolean"},{"name":"inline","desc":"Insert inline headers (SPS, PPS) to stream","type":"boolean"},{"name":"segment","desc":"Segment output file in to multiple files at specified interval <number>","type":"number"},{"name":"wrap","desc":"In segment mode, wrap any numbered filename back to 1 when reach number","type":"boolean"},{"name":"start","desc":"In segment mode, start with specified segment number","type":"boolean"},{"name":"split","desc":"In wait mode, create new output file for each start event","type":"boolean"},{"name":"circular","desc":"Run encoded data through circular buffer until triggered then save","type":"boolean"},{"name":"vectors","desc":"Output filename <string> for inline motion vectors","type":"string"},{"name":"irefresh","desc":"Set intra refresh type","type":"boolean"},{"name":"flush","desc":"Flush buffers in order to decrease latency","type":"boolean"},{"name":"save-pts","desc":"Save Timestamps to file for mkvmerge","type":"boolean"},{"name":"codec","desc":"Specify the codec to use - H264 (default) or MJPEG","type":"boolean"},{"name":"level","desc":"Specify H264 level to use for encoding","type":"boolean"},{"name":"raw","desc":"Output filename <string> for raw video","type":"string"},{"name":"raw-format","desc":"Specify output format for raw video. Default is yuv","type":"boolean"},{"name":"listen","desc":"Listen on a TCP socket","type":"boolean"},{"name":"spstimings","desc":"Add in h.264 sps timings","type":"boolean"},{"name":"slices","desc":"Horizontal slices per frame. Default 1 (off)","type":"boolean"},{"name":"width","desc":"Set image width <number>","type":"number"},{"name":"height","desc":"Set image height <number>","type":"number"},{"name":"output","desc":"Output filename <string> (to write to stdout, use '-o -'). If not specified, no file is saved","type":"string"},{"name":"verbose","desc":"Output verbose information during run","type":"boolean"},{"name":"camselect","desc":"Select camera <number>. Default 0","type":"number"},{"name":"mode","desc":"Force sensor mode. 0=auto. See docs for other modes available","type":"boolean"},{"name":"gpsdexif","desc":"Apply real-time GPS information to output (e.g. EXIF in JPG, annotation in video (requires libgps.so.23)","type":"boolean"},{"name":"preview","desc":"Preview window settings <string>","type":"string"},{"name":"fullscreen","desc":"Fullscreen preview mode","type":"boolean"},{"name":"opacity","desc":"Preview window opacity (0-255)","type":"boolean"},{"name":"nopreview","desc":"Do not display a preview window","type":"boolean"},{"name":"dispnum","desc":"Display on which to display the preview window (dispmanx/tvservice numbering)","type":"boolean"},{"name":"sharpness","desc":"Set image sharpness (-100 to 100)","type":"boolean"},{"name":"contrast","desc":"Set image contrast (-100 to 100)","type":"boolean"},{"name":"brightness","desc":"Set image brightness (0 to 100)","type":"boolean"},{"name":"saturation","desc":"Set image saturation (-100 to 100)","type":"boolean"},{"name":"ISO","desc":"Set capture ISO","type":"boolean"},{"name":"vstab","desc":"Turn on video stabilisation","type":"boolean"},{"name":"ev","desc":"Set EV compensation - steps of 1/6 stop","type":"boolean"},{"name":"exposure","desc":"Set exposure mode (see Notes)","type":"boolean"},{"name":"flicker","desc":"Set flicker avoid mode (see Notes)","type":"boolean"},{"name":"awb","desc":"Set AWB mode (see Notes)","type":"boolean"},{"name":"imxfx","desc":"Set image effect (see Notes)","type":"boolean"},{"name":"colfx","desc":"Set colour effect (U:V)","type":"boolean"},{"name":"metering","desc":"Set metering mode (see Notes)","type":"boolean"},{"name":"rotation","desc":"Set image rotation (0, 90, 180, or 270)","type":"boolean"},{"name":"hflip","desc":"Set horizontal flip","type":"boolean"},{"name":"vflip","desc":"Set vertical flip","type":"boolean"},{"name":"roi","desc":"Set region of interest (x,y,w,d as normalised coordinates [0.0-1.0])","type":"boolean"},{"name":"shutter","desc":"Set shutter speed in microseconds","type":"boolean"},{"name":"awbgains","desc":"Set AWB gains - AWB mode must be off","type":"boolean"},{"name":"drc","desc":"Set DRC Level (see Notes)","type":"boolean"},{"name":"stats","desc":"Force recomputation of statistics on stills capture pass","type":"boolean"},{"name":"annotate","desc":"Enable/Set annotate flags or text","type":"boolean"},{"name":"stereo","desc":"Select stereoscopic mode","type":"boolean"},{"name":"decimate","desc":"Half width/height of stereo image","type":"boolean"},{"name":"3dswap","desc":"Swap camera order for stereoscopic","type":"boolean"},{"name":"annotateex","desc":"Set extra annotation parameters (text size, text colour(hex YUV), bg colour(hex YUV), justify, x, y)","type":"boolean"},{"name":"analoggain","desc":"Set the analog gain (floating point)","type":"boolean"},{"name":"digitalgain","desc":"Set the digital gain (floating point)","type":"boolean"},{"name":"settings","desc":"Retrieve camera settings and write to stdout","type":"boolean"},{"name":"focus","desc":"Draw a window with the focus FoM value on the image.","type":"boolean"}]