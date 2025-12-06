import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  onModuleInit(): void {
    console.log('*** Application Module Initialized');
  }

  onModuleDestroy(): void {
    console.log('*** Application Module Shutting Down');
  }

  getHeadDoc(): string {
    return `
<div style="
  font-family: 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f7fa;
  padding: 40px;
  color: #333;
  height: 100vh;
">
  <h1 style="
    font-size: 32px;
    font-weight: 700;
    color: #2b6cb0;
    margin-bottom: 10px;
  ">
    RSS Home Library Service
  </h1>

  <p style="font-size: 16px; margin: 0 0 25px; color: #555;">
     olenaweb/nodejs2025Q4-service
  </p>

  <div style="
    display: flex;
    gap: 12px;
    margin-bottom: 25px;
  ">
    <a href="/doc" style="
      padding: 10px 18px;
      background: #2b6cb0;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      box-shadow: 0 3px 8px rgba(0,0,0,0.15);
      transition: 0.2s;
    ">📘 Swagger UI</a>

    <a href="/doc-yaml" style="
      padding: 10px 18px;
      background: #2f855a;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      box-shadow: 0 3px 8px rgba(0,0,0,0.15);
      transition: 0.2s;
    ">⭐ Doc Yaml</a>

    <a href="/user" style="
      padding: 10px 18px;
      background: #b83280;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      box-shadow: 0 3px 8px rgba(0,0,0,0.15);
      transition: 0.2s;
    ">👤 User</a>
  </div>

  <div style="
    background: white;
    border-radius: 10px;
    padding: 25px 35px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    width: 420px;
    line-height: 1.5;
  ">
    <h3 style="margin-top: 0; color: #2f855a;">Documentation</h3>
    <p style="margin: 5px 0 15px;">
      Available at <b style="color:#2b6cb0">/doc</b>
    </p>

    <h3 style="margin-bottom: 10px; color: #2f855a;">Endpoints</h3>

    <pre style="
      margin: 0;
      font-size: 15px;
      background: #edf2f7;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
    ">
user:      /user
artist:    /artist
album:     /album
track:     /track
favs:      /favs

favorites:
    /favs/artist/:id
    /favs/album/:id
    /favs/track/:id
    </pre>
  </div>
</div>
`;
  }
}
