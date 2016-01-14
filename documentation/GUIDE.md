# 1) Hardware INITIALIZATION

Standard ESC's may be hooked up to any Raspberry PI GPIO. Usually this cable is white. Black cables provided by the ESC need to
be hooked up to a GND (ground) pin. The red (5V) cables are not needed for the PI, as they provide external hardware with power.

[TODO: sensor]

# 2) Software INITIALIZATION

If you haven't initialized your drone for the Raspberry Pi, the ESC's will wait for their initialization. To do so, simply run:
`bash/activate_esc.bash [GPIO#]`
This will cause the ESC to stop beeping and is set to the ready state. The 'esc.js' library commands may now follow.

# 3) Library USAGE

[TODO]
