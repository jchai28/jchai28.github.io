import asyncio
import websockets

async def hello(websocket, path):
    name = await websocket.recv()
    print(name)
    await websocket.send(f"Hello {name}")
    print("Sent greeting to", name)

asyncio.get_event_loop().run_until_complete(
    websockets.serve(hello, "localhost", 4321)
)
asyncio.get_event_loop().run_forever()